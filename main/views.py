from django.shortcuts import render, redirect
from django.core.mail import send_mail
from django.contrib import messages
from django.views.generic import ListView, DetailView, TemplateView
from . import models
from django.conf import settings
class HomePageView(TemplateView):
    template_name = 'core/home.html'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        context['projects'] = models.Project.objects.prefetch_related('tags').all()[:3]
        context['blogs'] = models.Blog.objects.all()[:3]
        
        return context

def about_page(request):
    return render(request, 'core/about.html')

class ProjectListView(ListView):
    model = models.Project
    queryset = models.Project.objects.prefetch_related('tags').all()
    template_name = 'core/projects/project_list.html'
    context_object_name = 'project'

class BlogListView(ListView):
    model = models.Blog
    template_name = 'core/blog/blog_list.html'
    context_object_name = 'blogs'
    ordering = ['-created_at']

class BlogDetailView(DetailView):
    model = models.Blog
    template_name = 'core/blog/blog_detail.html'
    context_object_name = 'blog'
    slug_field = 'slug'
    slug_url_kwarg = 'slug'

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        
        current_post = self.object
        
        context['prev_post'] = models.Blog.objects.filter(
            created_at__lt=current_post.created_at
        ).order_by('-created_at').first()

        context['next_post'] = models.Blog.objects.filter(
            created_at__gt=current_post.created_at
        ).order_by('created_at').first()

        return context

def contact_page(request):
    if request.method == "POST":
        name = request.POST.get('name')
        email = request.POST.get('email')
        message = request.POST.get('message')

        subject = f"New message from Portfolio web-site: {name}"
        full_massage = f"Sender Name: {name}\nSender Email: {email}\n\nMessage text:\n{message}"

        try:
            send_mail(
                subject,
                full_massage,
                settings.EMAIL_HOST_USER,
                ['muhammadhonasrorov3@gmail.com'],
                fail_silently=False,
            )
            messages.success(request, "Your message has been sent successfully. As soon as I will connect you!")
            return redirect('contact')
        except Exception as e:
            print("ASL XATOLIK SABABI:", str(e))
            messages.error(request, "Error. Please Try again later!")
    return render(request, 'core/contact.html')

    