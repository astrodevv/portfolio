from django.contrib import admin
from . import models


databases = [models.Tags, models.Project, models.Blog]

admin.site.register(databases)