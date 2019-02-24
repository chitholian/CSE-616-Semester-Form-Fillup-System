
# IMPORTANT
Before reading this file please setup the Web App following the README.md file.


## To do initial data entry

- Login to [Django admin](http://127.0.0.1:8000/admin/) as a superuser (you created it by running `python manage.py createsuperuser` (see README.md).

### Follow the following sequence to avoid inconsistency.

- Add some Admin Users (i.e. dept. chairman, office, provost etc.)
- Add some Courses.
- Add some Departments.
- Add some Semesters.
- Add some Halls.





For your convenience we have created some sample data. To use the sample data rename the `db.sqlite3.sample` (in `website` folder) to `db.sqlite3` (override if exists).

### Superuser:
username: `admin`, password: `1234`


### Admin Users

username: `cse-chairman`, password: `1234`

username: `cse-office`, password: `1234`

username: `abdurrab-provost`, password: `1234`

username: `pritilata-provost`, password: `1234`

username: `accounts`, password: `1234`

username: `bank`, password: `1234`



Moreover, we have added 57 students in 7th Semester of CSE Department.


# Workflow (sequence must be followed)

(User must be logged in as a valid Admin User using Administrative Login from the Homepage).

(Students need to login using Student Login from the Homepage).

- Department Office will add new students.
- Department chairman will create exam.
- Student will apply for the exam.
- Department office will fill the attendance for each form. (After expiring last date of form fillup. To simulate it immediately you have to edit the exam from Django Admin Panel as super user, by setting the `ldo_form_fillup` to a past date).
- Accounts will impose fees and set the last date of payment.
- Hall Provost will approve the forms.
- Bank will confirm the payment. (Clicking the Cross icon in `Paid` column.)
- Student will download the admit card.
- Chairman will see the list of Students completed the payment.

