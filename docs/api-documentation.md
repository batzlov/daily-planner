# API-Dokumentation für daily-planner-api

## Allgemein

-   **Base URL**: {{baseUrl}} - hier: `http://localhost:3001`
-   **Authentifizierung**: Bearer Token ({{bearerToken}})

### todo-lists

#### CreateTodoList

-   **Beschreibung**: Schnittstelle zum erstellen einer neuen Todo-Liste.
-   **Methode**: POST
-   **URL**: {{baseUrl}}/todo-lists
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "title": "Haushalt & Putzen for me"
    }
    ```

#### ShareTodoListWith

-   **Beschreibung**: Schnittstelle zum teilen einer Todo-Liste mit einem anderen User. Nur der Ersteller der Todo-Liste kann diese teilen.
-   **Methode**: POST
-   **URL**: {{baseUrl}}/todo-lists/14/share-with
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "email": "tobias.gruber@example.com"
    }
    ```

#### UnshareTodoListWith

-   **Beschreibung**: Schnittstelle zum entfernen der Berechtigung zur Einsicht einer Todo-Liste für einen anderen User.
-   **Methode**: DELETE
-   **URL**: {{baseUrl}}/todo-lists/14/unshare-with/5
-   **Authentifizierung**: bearer

#### ReorderTodoList

-   **Beschreibung**: Schnittstelle zum neu ordnen der Todos einer Todo-Liste.
-   **Methode**: PUT
-   **URL**: {{baseUrl}}/todo-lists/1/reorder-todos
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "todos": [
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": true,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "1 Liter Bio-Milch",
                "id": 1,
                "order": 1,
                "title": "Milch kaufen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T13:10:12.832+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "Bio-Butter",
                "id": 3,
                "order": 2,
                "title": "Butter besorgen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T09:50:33+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T10:53:33.945+01:00",
                "deletedAt": null,
                "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
                "id": 27,
                "order": 3,
                "title": "Todo I",
                "todoListId": 1,
                "updatedAt": "2024-01-23T10:53:33.945+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "Frische Tomaten",
                "id": 6,
                "order": 4,
                "title": "Tomaten besorgen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T09:50:33+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "Vollkornbrot",
                "id": 2,
                "order": 5,
                "title": "Brot kaufen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T09:50:33+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "Bio-Kaffee",
                "id": 7,
                "order": 6,
                "title": "Kaffee kaufen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T09:50:33+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "Verschiedene Käsesorten",
                "id": 5,
                "order": 7,
                "title": "Käse kaufen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T09:50:33+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T09:50:33+01:00",
                "deletedAt": null,
                "description": "Frische Äpfel",
                "id": 4,
                "order": 8,
                "title": "Äpfel holen",
                "todoListId": 1,
                "updatedAt": "2024-01-23T09:50:33+01:00"
            },
            {
                "category": {
                    "createdAt": "0001-01-01T00:00:00Z",
                    "createdBy": 0,
                    "deletedAt": null,
                    "id": 0,
                    "title": "",
                    "updatedAt": "0001-01-01T00:00:00Z"
                },
                "categoryId": 1,
                "completed": false,
                "createdAt": "2024-01-23T10:54:10.698+01:00",
                "deletedAt": null,
                "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
                "id": 28,
                "order": 9,
                "title": "Todo II",
                "todoListId": 1,
                "updatedAt": "2024-01-23T10:54:10.698+01:00"
            }
        ]
    }
    ```

#### GetTodoLists

-   **Beschreibung**: Schnittstelle zum abrufen aller Todo-Listen eines Users, inklusive der geteilten.
-   **Methode**: GET
-   **URL**: {{baseUrl}}/todo-lists
-   **Authentifizierung**: bearer

#### UpdateTodoList

-   **Beschreibung**: Schnittstelle zum aktualisieren einer Todo-Liste, nur der Ersteller einer Liste kann diese aktualisieren.
-   **Methode**: PUT
-   **URL**: {{baseUrl}}/todo-lists/1
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "title": "Schäner Name Todo-List"
    }
    ```

#### GetTodoListById

-   **Beschreibung**: Schnittstelle zum abrufen einer Todo-Liste anhand der ID.
-   **Methode**: GET
-   **URL**: {{baseUrl}}/todo-lists/3
-   **Authentifizierung**: bearer

#### DeleteTodoList

-   **Beschreibung**: Schnittstelle zum löschen einer Todo-Liste, nur der Ersteller einer Liste kann diese löschen.
-   **Methode**: DELETE
-   **URL**: {{baseUrl}}/todo-lists/1
-   **Authentifizierung**: bearer

### categories

#### CreateCategory

-   **Beschreibung**: Schnittstelle zum erstellen einer neuen Kategorie.
-   **Methode**: POST
-   **URL**: {{baseUrl}}/categories
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "title": "Sport-Challenges"
    }
    ```

#### UpdateCategory

-   **Beschreibung**: Schnittstelle zum aktualisieren einer Kategorie. Nur durch den Nutzer selbst erstellte Kateogrien können aktualisiert werden.
-   **Methode**: PUT
-   **URL**: {{baseUrl}}/categories/27
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "title": "Challenges"
    }
    ```

#### DeleteCategory

-   **Beschreibung**: Schnittstelle zum löschen einer Kategorie. Nur durch den Nutzer selbst erstellte Kateogrien können gelöscht werden.
-   **Methode**: DELETE
-   **URL**: {{baseUrl}}/categories/29
-   **Authentifizierung**: bearer

#### GetCategories

-   **Beschreibung**: Schnittstelle zum abrufen aller Kategorien eines Users, inklusive der vom System erstellten Kategorien.
-   **Methode**: GET
-   **URL**: {{baseUrl}}/categories
-   **Authentifizierung**: bearer

### auth

#### SignUp

-   **Beschreibung**: Schnittstelle zum registrieren eines neuen Users.
-   **Methode**: POST
-   **URL**: {{baseUrl}}/sign-up
-   **Authentifizierung**: None
-   **Body**:
    ```json
    {
        "email": "johanna_blau@example.com",
        "firstName": "Johanne",
        "lastName": "Blau",
        "password": "password"
    }
    ```

#### SignIn

-   **Beschreibung**: Schnittstelle zum anmelden eines Users.
-   **Methode**: POST
-   **URL**: {{baseUrl}}/sign-in
-   **Authentifizierung**: None
-   **Body**:
    ```json
    {
        "email": "max.mustermann@example.com",
        "password": "password"
    }
    ```

#### SignOut

-   **Beschreibung**: Schnittstelle zum abmelden eines Users.
-   **Methode**: GET
-   **URL**: {{baseUrl}}/sign-out
-   **Authentifizierung**: None

### todos

#### CreateTodo

-   **Beschreibung**: Schnittstelle zum erstellen eines neuen Todos. Nur der Ersteller einer Todo-Liste kann Todos zu dieser hinzufügen.
-   **Methode**: POST
-   **URL**: {{baseUrl}}/todo-lists/1/todos
-   **Authentifizierung**: bearer
-   **Body**:
    ```json
    {
        "title": "Todo II",
        "description": "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et",
        "categoryId": 1
    }
    ```

#### UpdateTodo

-   **Beschreibung**: Schnittstelle zum aktualisieren eines Todos. Nur der Ersteller einer Todo-Liste kann Todos zu dieser aktualisieren.
-   **Methode**: PUT
-   **URL**: {{baseUrl}}/todo-lists/1/todos/6
-   **Authentifizierung**: None
-   **Body**:
    ```json
    {
        "title": "Todo neuer Titel",
        "description": "Eine Beschreibung",
        "completed": false,
        "categoryId": 1
    }
    ```

#### UpdateTodoCompleted

-   **Beschreibung**: Schnittstelle zum aktualisieren des Erledigt-Status eines Todos. Auch Nutzer die eine Todo-Liste geteilt bekommen haben können den Status eines Todos aktualisieren.
-   **Methode**: PUT
-   **URL**: {{baseUrl}}/todo-lists/1/todos/1/update-completed
-   **Authentifizierung**: None
-   **Body**:
    ```json
    {
        "completed": true
    }
    ```

#### DeleteTodo

-   **Beschreibung**: Schnittstelle zum löschen eines Todos. Nur der Ersteller einer Todo-Liste kann Todos zu dieser löschen.
-   **Methode**: DELETE
-   **URL**: {{baseUrl}}/todo-lists/1/todos/1
-   **Authentifizierung**: None
