from django.contrib import admin

from .models import *

admin.site.register(AdminUser)
admin.site.register(Hall)
admin.site.register(Course)
admin.site.register(Semester)
admin.site.register(Department)
admin.site.register(Student)
admin.site.register(Exam)
admin.site.register(ExamForm)
