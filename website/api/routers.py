from rest_framework import routers
from .views import *
router = routers.DefaultRouter()

router.register('admins', AdminUserViewSet)
router.register('halls', HallViewSet)
router.register('courses', CourseViewSet)
router.register('semesters', SemesterViewSet)
router.register('departments', DepartmentViewSet)
router.register('students', StudentViewSet)
router.register('exams', ExamViewSet)
router.register('exam-forms', ExamFormViewSet)
