from datetime import datetime
from app import app
from config import db
from models import Player, Game, GameNight, PlayerGame, Friendship, GameNightInvitation

def seed_data():
    with app.app_context():
        print("Clearing old data...")
        GameNightInvitation.query.delete()
        Friendship.query.delete() 
        PlayerGame.query.delete()
        GameNight.query.delete()
        Game.query.delete()
        Player.query.delete()
        
        print("Seeding players...")
        p1 = Player(username='BoardGameMaster')
        p1.password_hash = 'BoardGameMasterBoardGameMaster'
        p2 = Player(username='MeeplePerson')
        p2.password_hash = 'password456'
        p3 = Player(username='DiceRoller')
        p3.password_hash = 'password789'
        p4 = Player(username='CardShark') 
        p4.password_hash = 'cardpass'
        
        players = [p1, p2, p3, p4]
        db.session.add_all(players)
        db.session.commit()

        print("Seeding games...")
        g1 = Game(name='Catan', genre='Strategy')
        g2 = Game(name='Ticket to Ride', genre='Family')
        g3 = Game(name='Gloomhaven', genre='Cooperative')
        g4 = Game(name='Scythe', genre='Area Control')
        g5 = Game(name='Wingspan', genre='Engine Builder')

        games = [g1, g2, g3, g4, g5]
        db.session.add_all(games)
        db.session.commit()

        print("Seeding player game collections...")
        pg1 = PlayerGame(player_id=p1.id, game_id=g1.id, condition='Good')
        pg2 = PlayerGame(player_id=p1.id, game_id=g2.id, condition='New in Shrink')
        pg3 = PlayerGame(player_id=p2.id, game_id=g2.id, condition='Worn')
        pg4 = PlayerGame(player_id=p2.id, game_id=g3.id, condition='Good')
        pg5 = PlayerGame(player_id=p3.id, game_id=g4.id, condition='New in Shrink')
        pg6 = PlayerGame(player_id=p3.id, game_id=g5.id, condition='Good')

        player_games = [pg1, pg2, pg3, pg4, pg5, pg6]
        db.session.add_all(player_games)
        db.session.commit()

        print("Seeding game nights...")
        gn1 = GameNight(
            title="Strategy Sunday",
            location="p1's place",
            date=datetime(2025, 7, 20, 18, 0, 0),
            host_id=p1.id,
            is_public=True
        )
        gn2 = GameNight(
            title="Co-op Campaign Night",
            location="p2's apartment",
            date=datetime(2025, 7, 22, 19, 30, 0),
            host_id=p2.id,
            is_public=False
        )
        gn3 = GameNight(
            title="Scythe Showdown",
            location="p3's den",
            date=datetime(2025, 8, 1, 20, 0, 0),
            host_id=p3.id,
            is_public=True
        )

        game_nights = [gn1, gn2, gn3]
        db.session.add_all(game_nights)
        db.session.commit()

        print("Seeding friendships...")
        f1 = Friendship(requester_id=p1.id, recipient_id=p2.id, status='pending')
        f2 = Friendship(requester_id=p2.id, recipient_id=p3.id, status='accepted')
        f3 = Friendship(requester_id=p1.id, recipient_id=p4.id, status='accepted')

        friendships = [f1, f2, f3]
        db.session.add_all(friendships)
        db.session.commit()

        print("Seeding game night invitations...")
        gni1 = GameNightInvitation(game_night_id=gn1.id, invitee_id=p2.id, status='pending')
        gni2 = GameNightInvitation(game_night_id=gn2.id, invitee_id=p1.id, status='accepted')
        gni3 = GameNightInvitation(game_night_id=gn3.id, invitee_id=p4.id, status='declined')

        game_night_invitations = [gni1, gni2, gni3]
        db.session.add_all(game_night_invitations)
        db.session.commit()

        print("Seeding complete!")

if __name__ == '__main__':
    seed_data()
