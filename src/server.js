import express from "express";

import mainRouters from './main.routes'
import userRoutes from  './user.routes';

const app = express();
const port = 3000;


app.use(express.json())

app.use('/v1', mainRouters);
app.use('/v1/user', userRoutes);



app.listen(port, () => {
  console.log(`Server started on http://localhost:${port}`);
});
