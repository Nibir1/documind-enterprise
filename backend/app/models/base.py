# File: documind-enterprise/backend/app/models/base.py 
# Purpose: A shared Declarative Base for all models.

"""
Base Model Module
-----------------
Defines the common base class for SQLAlchemy models.
"""

from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    """
    Base class for all ORM models.
    Compatible with SQLAlchemy 2.0+ style mapping.
    """
    pass