from sqlalchemy.orm import validates
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.ext.associationproxy import association_proxy
from sqlalchemy.ext.hybrid import hybrid_property
from config import db, bcrypt
from datetime import datetime

class PlayerGame(db.Model, SerializerMixin):
    __tablename__ = 'player_games'

    id = db.Column(db.Integer, primary_key=True)
    condition = db.Column(db.String, nullable=False)
    player_id = db.Column(db.Integer, db.ForeignKey('players.id'))
    game_id = db.Column(db.Integer, db.ForeignKey('games.id'))

    player = db.relationship('Player', back_populates='player_games')
    game = db.relationship('Game', back_populates='player_games')

    serialize_rules = ('-player.player_games', '-game.player_games',)

    @validates('condition')
    def validate_condition(self, key, condition):
        conditions = ['New in Shrink', 'Good', 'Worn']
        if condition not in conditions:
            raise ValueError(f"Condition must be one of the following: {', '.join(conditions)}")
        return condition

class Friendship(db.Model, SerializerMixin):
    __tablename__ = 'friendships'

    id = db.Column(db.Integer, primary_key=True)
    status = db.Column(db.String, nullable=False, default='pending')
    
    requester_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    recipient_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)

    requester = db.relationship('Player', foreign_keys=[requester_id], back_populates='sent_friend_requests')
    recipient = db.relationship('Player', foreign_keys=[recipient_id], back_populates='received_friend_requests')

    __table_args__ = (db.UniqueConstraint('requester_id', 'recipient_id', name='_unique_friendship'),)

    serialize_rules = (
        'id', 'status',
        'requester_id', 'recipient_id',
        'requester.username',
        'recipient.username',
        '-requester',
        '-recipient',
    )

    @validates('status')
    def validate_status(self, key, status):
        valid_statuses = ['pending', 'accepted', 'declined', 'blocked']
        if status not in valid_statuses:
            raise ValueError(f"Status must be one of: {', '.join(valid_statuses)}")
        return status

class GameNightInvitation(db.Model, SerializerMixin):
    __tablename__ = 'game_night_invitations'

    id = db.Column(db.Integer, primary_key=True)
    game_night_id = db.Column(db.Integer, db.ForeignKey('game_nights.id'), nullable=False)
    invitee_id = db.Column(db.Integer, db.ForeignKey('players.id'), nullable=False)
    status = db.Column(db.String, nullable=False, default='pending')

    game_night = db.relationship('GameNight', back_populates='invitations')
    invitee = db.relationship('Player', back_populates='game_night_invitations')

    __table_args__ = (db.UniqueConstraint('game_night_id', 'invitee_id', name='_unique_game_night_invitation'),)

    serialize_rules = (
        'id', 'status',
        'game_night_id', 'invitee_id',
        'invitee.username',
        '-game_night',
        '-invitee',
    )

    @validates('status')
    def validate_status(self, key, status):
        valid_statuses = ['pending', 'accepted', 'declined']
        if status not in valid_statuses:
            raise ValueError(f"Invitation status must be one of: {', '.join(valid_statuses)}")
        return status

class Player(db.Model, SerializerMixin):
    __tablename__ = 'players'

    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, nullable=False, unique=True)
    _password_hash = db.Column(db.String, nullable=False)

    player_games = db.relationship('PlayerGame', back_populates='player', cascade='all, delete-orphan')
    games = association_proxy('player_games', 'game')

    game_nights_hosted = db.relationship('GameNight', back_populates='host', cascade='all, delete-orphan')
    game_night_invitations = db.relationship('GameNightInvitation', back_populates='invitee', cascade='all, delete-orphan')

    sent_friend_requests = db.relationship('Friendship', foreign_keys='Friendship.requester_id', back_populates='requester', cascade='all, delete-orphan')
    received_friend_requests = db.relationship('Friendship', foreign_keys='Friendship.recipient_id', back_populates='recipient', cascade='all, delete-orphan')
    
    @property
    def friends(self):
        accepted_sent = [f.recipient for f in self.sent_friend_requests if f.status == 'accepted']
        accepted_received = [f.requester for f in self.received_friend_requests if f.status == 'accepted']
        return list(set(accepted_sent + accepted_received))

    serialize_rules = (
        'id', 'username',
        '-player_games',
        '-games',
        '-game_nights_hosted',
        '-game_night_invitations',
        '-_password_hash',
        '-sent_friend_requests',
        '-received_friend_requests',
        '-friends',
    )

    @hybrid_property
    def password_hash(self):
        raise AttributeError('Password hashes may not be viewed.')

    @password_hash.setter
    def password_hash(self, password):
        password_hash = bcrypt.generate_password_hash(
            password.encode('utf-8'))
        self._password_hash = password_hash.decode('utf-8')

    def authenticate(self, password):
        return bcrypt.check_password_hash(
            self._password_hash, password.encode('utf-8'))

    @validates('username')
    def validate_username(self, key, username):
        if not username:
            raise ValueError("Username must be provided.")
        if len(username) < 3:
            raise ValueError("Username must be at least 3 characters long.")
        return username

class Game(db.Model, SerializerMixin):
    __tablename__ = 'games'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, nullable=False)
    genre = db.Column(db.String)
    
    player_games = db.relationship('PlayerGame', back_populates='game', cascade='all, delete-orphan')
    players = association_proxy('player_games', 'player')

    serialize_rules = ('-player_games.game',)

    @validates('name')
    def validate_name(self, key, name):
        if not name:
            raise ValueError("Game name must be provided.")
        return name

class GameNight(db.Model, SerializerMixin):
    __tablename__ = 'game_nights'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String, nullable=False)
    location = db.Column(db.String, nullable=False)
    date = db.Column(db.DateTime, nullable=False)
    is_public = db.Column(db.Boolean, default=False, nullable=False)
    host_id = db.Column(db.Integer, db.ForeignKey('players.id'))

    host = db.relationship('Player', back_populates='game_nights_hosted')
    invitations = db.relationship('GameNightInvitation', back_populates='game_night', cascade='all, delete-orphan')

    serialize_rules = (
        'id', 'title', 'location', 'date', 'host_id', 'is_public',
        'host.username',
        'invitations.invitee.username',
        'invitations.status',
        'invitations.id',
        '-host',
        '-invitations.game_night',
        '-invitations.invitee',
    )

    @validates('title')
    def validate_title(self, key, title):
        if not title:
            raise ValueError("Game night title must be provided.")
        return title

    @validates('location')
    def validate_location(self, key, location):
        if not location:
            raise ValueError("Location must be provided.")
        return location
