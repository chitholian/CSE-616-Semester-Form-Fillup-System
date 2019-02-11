
## Semester Form Fillup System
This is an educational repository for a project of the 6th semster course **CSE 616** titled **Web Engineering Lab**.

## How to ?
- Install **git >= 2.20.0, python >= 3.7, pip >= 18.1, virtualenv >= 16.2.0, nodejs >= v10.15.0, npm >= 6.4.1, WeasyPrint >= 44**
- Install GTK+ libraries (because **WeasyPrint** requires it). To do so follow instructions at [https://weasyprint.readthedocs.io/en/stable/install.html](https://weasyprint.readthedocs.io/en/stable/install.html)
- Open a **Terminal** or **Command Prompt**
- Clone this repository:

```
    git clone https://github.com/chitholian/CSE-616-Semester-Form-Fillup-System.git
```

- Enter the newly created directory:

```
    cd CSE-616-Semester-Form-Fillup-System
```

- Create a virtual environment for python (Optional):

```
    virtualenv env
```

- Activate the virtual environment (for **Windows**):

```
    env\Scripts\activate
```

- Activate the virtual environment (for **Linux** and **Mac**):

```
    source env/bin/activate
```

- Install required pip modules:

```
    pip install -r requirements.txt
```

- Install Angular CLI globally (If you didn't already; this may require SU privillege, so run with **sudo** (in **Linux** and **Mac**) or **Administrator** in **Windows**):

```
    npm install -g @angular/cli
```

- Enter the frontend directory and install node modules:

```
    cd frontend
    npm ci install
```

- Compile frontend resources:

```
    ng build
```

- Enter Django project root directory (which contains the "manage.py" file):

```
    cd ../website/
```

- Create database migrations:

```
    python manage.py makemigrations
```

- Run database migrations:

```
    python manage.py migrate
```

- Create a super user:

```
    python manage.py createsuperuser
```

- Start Django development server:

```
    python manage.py runserver
```

- Now open [http://127.0.0.1:8000/](http://127.0.0.1:8000/) with your web browser.

- You need to create some entities like Department, Semester, Hall, Course, Admin Users etc. from Django Admin Backend. To do so go to [http://127.0.0.1:8000/admin/](http://127.0.0.1:8000/admin/)
