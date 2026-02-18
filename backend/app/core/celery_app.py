from celery import Celery
from app.core.config import settings

celery_app = Celery("worker", broker=f"redis://{settings.REDIS_HOST}:{settings.REDIS_PORT}/{settings.REDIS_DB}")

celery_app.conf.task_routes = {"app.worker.test_celery": "main-queue"}
