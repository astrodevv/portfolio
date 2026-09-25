from django.db import models
from django.urls import reverse

class Tags(models.Model):
    name = models.CharField(max_length=50, unique=True, verbose_name="Tags")



class Project(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    image = models.ImageField(upload_to='project_list/', blank=True, verbose_name="Image")
    text = models.TextField(max_length=100, verbose_name="Text")
    tags = models.ManyToManyField(Tags, related_name='projects', blank=True, verbose_name="Technologies")
    live_url = models.URLField(blank=True, null=True, verbose_name="Live Url")
    github_url = models.URLField(blank=True, null=True, verbose_name="GitHub Url")
    date = models.DateField(verbose_name="Date", auto_now_add=True)

    class Meta:
        ordering = ['-date']

    def __str__(self):
        return self.title

class Blog(models.Model):
    title = models.CharField(max_length=255, verbose_name="Title")
    text = models.TextField(verbose_name="Text")
    slug = models.SlugField(unique=True, verbose_name="Blog title")
    image = models.ImageField(upload_to='blog_images/', default='blog_default_pic/', blank=True, verbose_name="Image")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Date and Time")

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('blog_detail', kwargs={'slug': self.slug})
    
