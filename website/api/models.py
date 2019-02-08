from django.contrib.auth.models import User
from django.db import models

ADMIN_TYPES = (
    ('office', 'Department Office'),
    ('chairman', 'Department Chairman'),
    ('accounts', 'Accounts Office'),
    ('provost', 'Hall Provost'),
    ('bank', 'Bank'),
)

GENDERS = (
    ('male', 'Male'),
    ('female', 'Female'),
    ('other', 'Other'),
)

RELIGIONS = (
    ('islam', 'Islam'),
    ('hinduism', 'Hinduism'),
    ('christianity', 'Christianity'),
    ('buddhism', 'Buddhism'),
    ('other', 'Other'),
)

EXAM_STATES = (
    (1, 'Pending for attendance entry'),
    (2, 'Pending for chairman approval'),
    (3, 'Pending for provost approval'),
    (4, 'Pending for fees imposure'),
    (5, 'Pending for payment'),
    (6, 'Payment completed'),
)

FORM_STATES = EXAM_STATES + (
    (0, 'Not applied yet'),
)


class AdminUser(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    type = models.CharField(max_length=16, choices=ADMIN_TYPES)

    def __str__(self):
        return "{}: {}".format(self.user.username, self.type)


class Department(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True)
    alias = models.CharField(max_length=16)
    chairman = models.ForeignKey(AdminUser, on_delete=models.CASCADE, related_name='chairman')
    officer = models.ForeignKey(AdminUser, on_delete=models.CASCADE, related_name='officer')

    def __str__(self):
        return "{}".format(self.name)


class Course(models.Model):
    code = models.CharField(max_length=16, primary_key=True)
    title = models.CharField(max_length=128)
    credits = models.PositiveIntegerField()

    def __str__(self):
        return "{} {}".format(self.code, self.title)


class Semester(models.Model):
    id = models.AutoField(primary_key=True)
    number = models.PositiveIntegerField()
    year = models.PositiveIntegerField()
    active = models.BooleanField(default=True)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    courses = models.ManyToManyField(Course)

    def __str__(self):
        return "{}, {} @ {}".format(self.number, self.year, self.department.alias)

    class Meta:
        unique_together = ('number', 'year', 'department')


class Hall(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=128, unique=True)
    gender = models.CharField(max_length=16, choices=GENDERS)
    provost = models.ForeignKey(AdminUser, on_delete=models.CASCADE)
    departments = models.ManyToManyField(Department)

    def __str__(self):
        return "{}".format(self.name)


class Student(models.Model):
    id = models.PositiveIntegerField(primary_key=True)
    name = models.CharField(max_length=128)
    session = models.CharField(max_length=11)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    department = models.ForeignKey(Department, on_delete=models.CASCADE)
    hall = models.ForeignKey(Hall, on_delete=models.CASCADE)

    gender = models.CharField(max_length=16, choices=GENDERS)
    religion = models.CharField(max_length=16, choices=RELIGIONS)
    dob = models.DateField()
    phone = models.CharField(max_length=20)
    email = models.EmailField()
    address = models.TextField(max_length=256)

    def __str__(self):
        return "{} {}".format(self.id, self.name)


class Exam(models.Model):
    id = models.AutoField(primary_key=True)
    title = models.CharField(max_length=128)
    semester = models.ForeignKey(Semester, on_delete=models.CASCADE)
    active = models.BooleanField(default=True)
    fees_per_credit = models.PositiveIntegerField(default=50)
    allowed_attendance = models.PositiveIntegerField(default=70)
    fined_attendance = models.PositiveIntegerField(default=60)
    attendance_fine = models.PositiveIntegerField(default=600)
    ldo_form_fill_up = models.DateField()
    ldo_payment = models.DateField(null=True, default=None)
    status = models.PositiveSmallIntegerField(choices=EXAM_STATES, default=1)

    def __str__(self):
        return "{}".format(self.title)


class ExamForm(models.Model):
    id = models.AutoField(primary_key=True)
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    status = models.PositiveSmallIntegerField(choices=FORM_STATES, default=1)
    attendance = models.SmallIntegerField(default=-1)

    def __str__(self):
        return "{} @ {}".format(self.student.id, self.exam.title)

    class Meta:
        unique_together = ('exam', 'student')
