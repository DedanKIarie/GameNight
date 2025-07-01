#!/usr/bin/env python3

from flask import request, session, make_response
from flask_restful import Resource
from sqlalchemy.exc import IntegrityError
from sqlalchemy import or_
from datetime import datetime
from flask_migrate import Migrate

from config import app, db, api
from models import Player, Game, GameNight, PlayerGame, Friendship, GameNightInvitation

# Initialize Flask-Migrate
migrate = Migrate(app, db)

class Signup(Resource):
    def post(self):
        data = request.get_json()
        new_player = Player(
            username=data.get('username'),
        )
        new_player.password_hash = data.get('password')
        try:
            db.session.add(new_player)
            db.session.commit()
            session['player_id'] = new_player.id
            return make_response(new_player.to_dict(), 201)
        except IntegrityError:
            db.session.rollback()
            return make_response({'error': 'Username already exists'}, 422)
        except ValueError as e:
            return make_response({'error': str(e)}, 422)

class CheckSession(Resource):
    def get(self):
        player_id = session.get('player_id')
        if player_id:
            player = Player.query.filter(Player.id == player_id).first()
            return make_response(player.to_dict(only=('id', 'username')), 200)
        return make_response({}, 204)

class Login(Resource):
    def post(self):
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        player = Player.query.filter(Player.username == username).first()
        if player:
            if player.authenticate(password):
                session['player_id'] = player.id
                return make_response(player.to_dict(only=('id', 'username')), 200)
        return make_response({'error': '401 Unauthorized'}, 401)

class Logout(Resource):
    def delete(self):
        session['player_id'] = None
        return make_response({}, 204)

class Games(Resource):
    def get(self):
        games = [game.to_dict() for game in Game.query.all()]
        return make_response(games, 200)
    
    def post(self):
        data = request.get_json()
        try:
            new_game = Game(name=data['name'], genre=data.get('genre'))
            db.session.add(new_game)
            db.session.commit()
            return make_response(new_game.to_dict(), 201)
        except ValueError as e:
            return make_response({'error': str(e)}, 422)

class GameByID(Resource):
    def get(self, id):
        game = Game.query.get(id)
        if not game:
            return make_response({'error': 'Game not found'}, 404)
        return make_response(game.to_dict(), 200)
    
    def patch(self, id):
        game = Game.query.get(id)
        if not game:
            return make_response({'error': 'Game not found'}, 404)
        data = request.get_json()
        try:
            for attr in data:
                setattr(game, attr, data[attr])
            db.session.commit()
            return make_response(game.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': str(e)}, 422)

    def delete(self, id):
        game = Game.query.get(id)
        if not game:
            return make_response({'error': 'Game not found'}, 404)
        db.session.delete(game)
        db.session.commit()
        return make_response({}, 204)

class GameNights(Resource):
    def get(self):
        game_nights = [gn.to_dict(rules=('id', 'title', 'location', 'date', 'host_id', 'host.username', 'invitations.id', 'invitations.status', 'invitations.invitee.username')) for gn in GameNight.query.all()]
        return make_response(game_nights, 200)

    def post(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        data = request.get_json()
        try:
            date_obj = datetime.fromisoformat(data['date'])
            if date_obj < datetime.now():
                raise ValueError("Game night date cannot be in the past.")

            new_game_night = GameNight(
                title=data['title'],
                location=data['location'],
                date=date_obj,
                host_id=player_id
            )
            db.session.add(new_game_night)
            db.session.commit()
            return make_response(new_game_night.to_dict(), 201)
        except ValueError as e:
            return make_response({'error': str(e)}, 422)

class GameNightByID(Resource):
    def get(self, id):
        game_night = GameNight.query.get(id)
        if not game_night:
            return make_response({'error': 'Game night not found'}, 404)
        return make_response(game_night.to_dict(rules=('id', 'title', 'location', 'date', 'host_id', 'host.username', 'invitations.id', 'invitations.status', 'invitations.invitee.username')), 200)

    def patch(self, id):
        game_night = GameNight.query.get(id)
        player_id = session.get('player_id')
        if not game_night or game_night.host_id != player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        data = request.get_json()
        try:
            for attr in data:
                if attr == 'date':
                    date_obj = datetime.fromisoformat(data[attr])
                    if date_obj < datetime.now():
                        raise ValueError("Game night date cannot be in the past.")
                    setattr(game_night, attr, date_obj)
                else:
                    setattr(game_night, attr, data[attr])
            db.session.commit()
            return make_response(game_night.to_dict(), 200)
        except ValueError as e:
            return make_response({'error': str(e)}, 422)

    def delete(self, id):
        game_night = GameNight.query.get(id)
        player_id = session.get('player_id')
        if not game_night or game_night.host_id != player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        db.session.delete(game_night)
        db.session.commit()
        return make_response({}, 204)

class PlayerGames(Resource):
    def post(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        data = request.get_json()
        try:
            new_player_game = PlayerGame(
                condition=data['condition'],
                player_id=player_id,
                game_id=data['game_id']
            )
            db.session.add(new_player_game)
            db.session.commit()
            return make_response(new_player_game.to_dict(), 201)
        except ValueError as e:
            return make_response({'error': str(e)}, 422)
        except IntegrityError:
            db.session.rollback()
            return make_response({'error': 'You already own this game.'}, 422)

class FriendRequests(Resource):
    def post(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        data = request.get_json()
        recipient_username = data.get('username')
        
        if not recipient_username:
            return make_response({'error': 'Recipient username required'}, 400)
        
        recipient = Player.query.filter_by(username=recipient_username).first()
        if not recipient:
            return make_response({'error': 'Recipient not found'}, 404)
        
        if recipient.id == player_id:
            return make_response({'error': 'Cannot send friend request to self'}, 400)
        
        existing_request = Friendship.query.filter(
            or_(
                (Friendship.requester_id == player_id, Friendship.recipient_id == recipient.id),
                (Friendship.requester_id == recipient.id, Friendship.recipient_id == player_id)
            )
        ).first()

        if existing_request:
            if existing_request.status == 'pending':
                return make_response({'message': 'Friend request already pending'}, 409)
            elif existing_request.status == 'accepted':
                return make_response({'message': 'Already friends'}, 409)
            elif existing_request.status == 'blocked':
                return make_response({'message': 'User is blocked or has blocked you'}, 403)
        try:
            new_request = Friendship(
                requester_id=player_id,
                recipient_id=recipient.id,
                status='pending'
            )
            db.session.add(new_request)
            db.session.commit()
            return make_response({'message': 'Friend request sent', 'friendship_id': new_request.id}, 201)
        except IntegrityError:
            db.session.rollback()
            return make_response({'error': 'Friend request already exists'}, 409)
        except ValueError as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 422)

class FriendRequestManagement(Resource):
    def patch(self, friendship_id):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        friendship = Friendship.query.get(friendship_id)
        if not friendship:
            return make_response({'error': 'Friend request not found'}, 404)

        if friendship.recipient_id != player_id:
            return make_response({'error': '403 Forbidden'}, 403)

        data = request.get_json()
        action = data.get('action')

        if action == 'accept':
            friendship.status = 'accepted'
            message = 'Friend request accepted'
        elif action == 'decline':
            friendship.status = 'declined'
            message = 'Friend request declined'
        else:
            return make_response({'error': 'Invalid action'}, 400)
        
        try:
            db.session.commit()
            return make_response({'message': message}, 200)
        except ValueError as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 422)

    def delete(self, friendship_id):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        friendship = Friendship.query.get(friendship_id)
        if not friendship:
            return make_response({'error': 'Friendship not found'}, 404)
        
        if friendship.requester_id == player_id or friendship.recipient_id == player_id:
            db.session.delete(friendship)
            db.session.commit()
            return make_response({'message': 'Friendship removed'}, 204)
        else:
            return make_response({'error': '403 Forbidden'}, 403)

class PlayerFriends(Resource):
    def get(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        player = Player.query.get(player_id)
        if not player:
            return make_response({'error': 'Player not found'}, 404)
        
        friends_list = []
        for friend in player.friends:
            friends_list.append({'id': friend.id, 'username': friend.username})
        
        return make_response(friends_list, 200)

class PlayerFriendRequests(Resource):
    def get(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        player = Player.query.get(player_id)
        if not player:
            return make_response({'error': 'Player not found'}, 404)
        
        pending_requests = []
        for req in player.received_friend_requests:
            if req.status == 'pending':
                pending_requests.append({
                    'id': req.id,
                    'status': req.status,
                    'requester_id': req.requester_id,
                    'requester': {'username': req.requester.username}
                })
        return make_response(pending_requests, 200)

class FriendGameNights(Resource):
    def get(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        player = Player.query.get(player_id)
        if not player:
            return make_response({'error': 'Player not found'}, 404)
        
        friend_game_nights = []
        for friend in player.friends:
            for gn in friend.game_nights_hosted:
                game_night_data = gn.to_dict(rules=('id', 'title', 'location', 'date', 'host_id'))
                game_night_data['host_username'] = friend.username
                friend_game_nights.append(game_night_data)
        
        friend_game_nights.sort(key=lambda x: datetime.fromisoformat(x['date']), reverse=True)

        return make_response(friend_game_nights, 200)

class GameNightInvitations(Resource):
    def post(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        data = request.get_json()
        game_night_id = data.get('game_night_id')
        invitee_username = data.get('invitee_username')

        if not game_night_id or not invitee_username:
            return make_response({'error': 'Game night ID and invitee username required'}, 400)
        
        game_night = GameNight.query.get(game_night_id)
        if not game_night:
            return make_response({'error': 'Game night not found'}, 404)
        
        if game_night.host_id != player_id:
            return make_response({'error': '403 Forbidden: Only host can invite'}, 403)
        
        invitee = Player.query.filter_by(username=invitee_username).first()
        if not invitee:
            return make_response({'error': 'Invitee not found'}, 404)
        
        if invitee.id == player_id:
            return make_response({'error': 'Cannot invite self to game night'}, 400)
        
        existing_invitation = GameNightInvitation.query.filter_by(
            game_night_id=game_night_id,
            invitee_id=invitee.id
        ).first()

        if existing_invitation:
            return make_response({'message': 'Already invited to this game night'}, 409)

        try:
            new_invitation = GameNightInvitation(
                game_night_id=game_night_id,
                invitee_id=invitee.id,
                status='pending'
            )
            db.session.add(new_invitation)
            db.session.commit()
            return make_response({'message': f'Invitation sent to {invitee_username}', 'invitation': new_invitation.to_dict()}, 201)
        except IntegrityError:
            db.session.rollback()
            return make_response({'error': 'Invitation already exists'}, 409)
        except ValueError as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 422)

class GameNightInvitationManagement(Resource):
    def patch(self, invitation_id):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        invitation = GameNightInvitation.query.get(invitation_id)
        if not invitation:
            return make_response({'error': 'Invitation not found'}, 404)

        if invitation.invitee_id != player_id:
            return make_response({'error': '403 Forbidden'}, 403)
        
        data = request.get_json()
        action = data.get('action')

        if action == 'accept':
            invitation.status = 'accepted'
            message = 'Invitation accepted'
        elif action == 'decline':
            invitation.status = 'declined'
            message = 'Invitation declined'
        else:
            return make_response({'error': 'Invalid action'}, 400)
        
        try:
            db.session.commit()
            return make_response({'message': message, 'invitation': invitation.to_dict()}, 200)
        except ValueError as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 422)

    def delete(self, invitation_id):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        invitation = GameNightInvitation.query.get(invitation_id)
        if not invitation:
            return make_response({'error': 'Invitation not found'}, 404)
        
        game_night = GameNight.query.get(invitation.game_night_id)

        if game_night.host_id == player_id or invitation.invitee_id == player_id:
            db.session.delete(invitation)
            db.session.commit()
            return make_response({'message': 'Invitation removed'}, 204)
        else:
            return make_response({'error': '403 Forbidden'}, 403)

class PlayerGameNightInvitations(Resource):
    def get(self):
        player_id = session.get('player_id')
        if not player_id:
            return make_response({'error': '401 Unauthorized'}, 401)
        
        player = Player.query.get(player_id)
        if not player:
            return make_response({'error': 'Player not found'}, 404)
        
        invitations = [
            inv.to_dict(rules=('id', 'status', 'game_night_id', 'game_night.title', 'game_night.date', 'game_night.location', 'game_night.host.username'))
            for inv in player.game_night_invitations
        ]
        return make_response(invitations, 200)


api.add_resource(Signup, '/signup', endpoint='signup')
api.add_resource(CheckSession, '/check_session', endpoint='check_session')
api.add_resource(Login, '/login', endpoint='login')
api.add_resource(Logout, '/logout', endpoint='logout')
api.add_resource(Games, '/games', endpoint='games')
api.add_resource(GameByID, '/games/<int:id>', endpoint='game_by_id')
api.add_resource(GameNights, '/gamenights', endpoint='gamenights')
api.add_resource(GameNightByID, '/gamenights/<int:id>', endpoint='gamenight_by_id')
api.add_resource(PlayerGames, '/player_games', endpoint='player_games')
api.add_resource(FriendRequests, '/friend_requests', endpoint='friend_requests')
api.add_resource(FriendRequestManagement, '/friend_requests/<int:friendship_id>', endpoint='friend_request_management')
api.add_resource(PlayerFriends, '/players/me/friends', endpoint='player_friends')
api.add_resource(PlayerFriendRequests, '/players/me/friend_requests/pending', endpoint='player_pending_friend_requests')
api.add_resource(FriendGameNights, '/friends_gamenights', endpoint='friends_gamenights')
api.add_resource(GameNightInvitations, '/gamenight_invitations', endpoint='gamenight_invitations')
api.add_resource(GameNightInvitationManagement, '/gamenight_invitations/<int:invitation_id>', endpoint='gamenight_invitation_management')
api.add_resource(PlayerGameNightInvitations, '/players/me/gamenight_invitations', endpoint='player_gamenight_invitations')


if __name__ == '__main__':
    app.run(port=5555, debug=True)
