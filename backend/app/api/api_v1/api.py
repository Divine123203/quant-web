from fastapi import APIRouter
from app.api.api_v1.endpoints import matches, system, tickets, login

api_router = APIRouter()
api_router.include_router(matches.router, prefix="/matches", tags=["matches"])
api_router.include_router(system.router, prefix="/system", tags=["system"])
api_router.include_router(tickets.router, prefix="/tickets", tags=["tickets"])
api_router.include_router(login.router, tags=["login"])
