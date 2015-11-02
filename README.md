# User service

### Public api

**call@fr.saio.api.license.[license].user.get.[userId]**
```
input: null
output: user
```
**call@fr.saio.api.license.[license].user.getAll**
```
input: null
output: [user]
```
**call@fr.saio.api.license.[license].user.create**
```
input: user {
  firstname: String,
  lastname: String,
  email: Email,
  password: String(min 8),
  avatar: Url,
  roles: Array("Admin", "ChatOperator", "KnowledgeOperator")
}
output: user
```
**call@fr.saio.api.license.[license].user.update.[userId]**
```
input: user {
  firstname: String,
  lastname: String,
  email: Email,
  password: String(min 8) or null to not change it,
  avatar: Url,
  roles: Array("Admin", "ChatOperator", "KnowledgeOperator")
}
output: user
```
**call@fr.saio.api.license.[license].user.delete.[userId]**
```
input: null
output: null
```

### Internal api
**call@fr.saio.internal.user.login**
```
input: {
  email: String,
  password: String (not hashed)
}
output: user
```


### How to test

```
npm test
npm run test.integration
```

### How to deploy

Simply commit or pr in develop branch for staging environment, or master for production.
This will automatically build & push containers in our Kubernetes cluster.
