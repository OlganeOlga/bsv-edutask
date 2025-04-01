The new commando for instalation of the dependencies in the frontend is `npm install --include=dev`.

After dependencyes installation I get 160 vulnerabilities (4 low, 111 moderate, 36 high, 9 critical)
Rund `npm audit fix`get: 140 vulnerabilities (102 moderate, 31 high, 7 critical)

The backend should running in python environment. I do it on anaconda.

After compleeting all steps from README.md I get browser window where I can add my username.
There are no possibilityes to signup and also no password possibilityes.

On the backend prompt I get: 
```
Error: more than one user found with mail o_yegorova@yahoo.com
IndexError: list index out of range
127.0.0.1 - - [01/Apr/2025 15:08:51] "GET /users/bymail/o_yegorova@yahoo.com HTTP/1.1" 500 -
```
Application recognises absence of @ but do not recognises absence of '.'
