const {app}=require('../server');
const orders=require('../controllers/orders_controller');
//GET DOS VALORES DE ORDER E SUPPLIER
app.get('/OrdersGetAll/', orders.read);
//GET DOS VALORES DE ORDER E ORDERED_RPODUCT, PRECISA DE: 
//order_id
app.get('/OrderProductByOrderID/:order_id', orders.OrderProductByID);
//GET DOS VALORES DOS SUPPLIERS
app.get('/SuppliersGetAll/', orders.GetSuppliers);
<<<<<<< HEAD
//post do ordered_product
app.post('/InsertOrderedProducts',orders.InsertOrdered);
=======
//POST DE UMA ORDER
app.post('/OrderPost/', orders.saveOrder);

>>>>>>> b897ff683a63de7ff077849049788508590dbfd6
