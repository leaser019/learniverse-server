# Learniverse Server

## Overview

The Learniverse Server is the beating heart of the Learniverse learning system. It serves up delicious APIs for managing learning resources, handling user authentication, and all the other spicy core features. Put simply: without it, Learniverse is just a pretty face with no soul — like your crush leaving you on read, ouch!

## Technologies

- **Node.js**: The backbone of the server — fast, powerful.
- **Express.js**: A lightweight yet solid framework.

## Prerequisites

**Node.js (v16 or higher)**:

## Environment Variables

Create a .env file in the root directory and plug in these variables, or the server will cry... and nobody wants that:

```.env
NODE_ENV=development           # or production
PORT=xxxx                      # server port
DEV_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
PRO_MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority
```
"# ecommer-sever" 
