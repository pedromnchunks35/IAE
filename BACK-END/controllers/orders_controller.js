const connect = require('../config/connect');
const purchase_order_controller = require('./purchase_order_controller');
const {http}=require('../authtoken/molonitoken');
//FUNÇÃO PARA DEOLVER OS DADOS DOORDER E SUPPLIER 
function read(req, res) {
    connect.con.query('SELECT iae.order.order_id, iae.order.supplier_id, iae.order.date, iae.order.expire_date, iae.order.total, iae.order.document_id, iae.order.status_payment, iae.supplier.designation, count(iae.ordered_product.order_id) as OrderedProducts_orderid_count FROM iae.order LEFT JOIN iae.supplier ON iae.order.supplier_id = iae.supplier.supplier_id LEFT JOIN iae.ordered_product ON iae.ordered_product.order_id = iae.order.order_id group by iae.order.order_id' , function(error, result){
      //caso de erro ,manda msg de erro
        if (error){
          //ENVIAR STATUS DE ERRO
          res.status(400).send({
            "msg": "Error, something went wrong"
        });
        //PRINTAR NA CONSOLA ERRO
          return console.error(error);
        }else{
        //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
        console.log(result);
        res.send(result);
        }
    });
}

//FUNÇÃO PARA DEVOLVER OS VALORES DO ORDER E ORDERED_PRODUCT COM O MESMO order_id
function OrderProductByID(req, res) {
    const order_id = req.sanitize('order_id').escape();
    connect.con.query('SELECT iae.order.order_id as order_id, iae.order.supplier_id as supplier_id_order, iae.order.date as date_order, iae.order.expire_date as expire_date_order, iae.order.total as total_order, iae.order.document_id as document_id_order, iae.order.status_payment as status_payment, iae.ordered_product.description as designation_ordered_product, iae.ordered_product.order_id as order_id_ordered_product, iae.ordered_product.ordered_product_id as ordered_product_id_ordered_product, iae.ordered_product.quantity as quantity_ordered_product, iae.ordered_product.total as total_ordered_product, iae.ordered_product.unit_price as unit_price_ordered_product FROM iae.ordered_product JOIN iae.order ON iae.ordered_product.order_id = iae.order.order_id WHERE iae.order.order_id = ?', order_id, function(error, result) {
      //caso de erro ,manda msg de erro
      if (error){
        //ENVIAR STATUS DE ERRO
        res.status(400).send({
          "msg": "Error, something went wrong"
      });
      //PRINTAR NA CONSOLA ERRO
        return console.error(error);
      }else{
      //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
      console.log(result);
      res.send(result);
      }
  });
}

//FUNÇÃO PARA DEVOLVER TODOS OS VALORES DO SUPPLIER
function GetSuppliers(req, res) {
  connect.con.query('SELECT iae.supplier.designation, iae.supplier.supplier_id, iae.supplier.morada, iae.supplier.zip_code, iae.supplier.county, iae.supplier.district FROM iae.supplier' , function(error, result){
    //caso de erro ,manda msg de erro
      if (error){
        //ENVIAR STATUS DE ERRO
        res.status(400).send({
          "msg": "Error, something went wrong"
      });
      //PRINTAR NA CONSOLA ERRO
        return console.error(error);
      }else{
      //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
      console.log(result);
      res.send(result);
      }
  });
}
//FUNCAO PARA INSERIR NO ORDERED_PRODUCTS
function InsertOrdered(req,res){
  //IR BUSCAR OS DADOS
  const order_id=req.body.order_id;
  const description=req.body.description;
  const quantity=req.body.quantity;
  const unit_price=req.body.unit_price;
  const total=req.body.total;
  //INSERIR AQUI OS DADOS
  var post = {
    order_id:order_id,
    description:description,
    quantity:quantity,
    unit_price:unit_price,
    total:total
};
//CONEXAO
query=connect.con.query('INSERT INTO iae.ordered_product SET ?',post,function(err,rows,fields){
console.log(query.sql);
if(!err){
  res.status(200).location(rows.insertedId).send(
    {
      "msg": "Inserted with success"
    }
  );
  console.log("Number of records inserted: "+rows.affectedRows);
}else{


if(err.code=="ER_DUP_ENTRY"){

  res.status(409).send({"msg": err.code});
  console.log('Error while performing Query.', err);


} else res.status(400).send({"msg": err.code});


}

});

}


//FUNCAO PARA INSERIR NO ORDERED_PRODUCTS
function InsertOrderedArray(req,res){
  //IR BUSCAR OS DADOS
  const array=req.body.array;
  console.log(array);
//CONEXAO
query=connect.con.query('INSERT INTO iae.ordered_product SET (order_id,description,quantity,unit_price,total)',array,function(err,rows,fields){
console.log(query.sql);
if(!err){
  res.status(200).location(rows.insertedId).send(
    {
      "msg": "Inserted with success"
    }
  );
  console.log("Number of records inserted: "+rows.affectedRows);
}else{


if(err.code=="ER_DUP_ENTRY"){

  res.status(409).send({"msg": err.code});
  console.log('Error while performing Query.', err);


} else res.status(400).send({"msg": err.code});


}

});

}

//FUNÇÃO PARA FAZER PUT  TABELA ORDER 
function saveOrder(req, res) {
  //receber os dados do formuário que são enviados por post
  const order_id = req.sanitize('order_id').escape();
  const supplier_id = req.sanitize('supplier_id').escape();
  const date = req.sanitize('date').escape();
  const expire_date = req.sanitize('expire_date').escape();
  const total = req.sanitize('total').escape();   
  const document_id = req.sanitize('document_id').escape();
  var query = "";
      var post = { 
        order_id: order_id,
        supplier_id: supplier_id,
        date: date,
        expire_date: expire_date,
        total: total,
        document_id: document_id
      };
      query = connect.con.query('INSERT INTO iae.order SET ?', post, function (err, rows, fields) {
          console.log(query.sql);
          if (!err) {
              res.status(200).location(rows.insertId).send({
              "msg": "inserted with success"
          });
          console.log("Number of records inserted: " + rows.affectedRows);
      } else {
          if (err.code == "ER_DUP_ENTRY") {
              res.status(409).send({"msg": err.code});
              console.log('Error while performing Query.', err);
          } else res.status(400).send({"msg": err.code});
      }
  });
}



//FUNÇÃO GET ORDER_ID POR DOCUMENT_ID
function GetOrderId(req, res) {
  const document_id = req.sanitize('document_id').escape();
  connect.con.query('SELECT iae.order.order_id FROM iae.order WHERE document_id = ?', document_id, function(error, result){
    //caso de erro ,manda msg de erro
      if (error){
        //ENVIAR STATUS DE ERRO
        res.status(400).send({
          "msg": "Error, something went wrong"
      });
      //PRINTAR NA CONSOLA ERRO
        return console.error(error);
      }else{
      //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
      console.log(result);
      res.send(result);
      }
  });
}


//FUNÇÃO PARA FAZER DELETE DE UMA ORDER ID E ORDERED_PRODUCT DANDO O ORDER_ID
function DeleteOrderID(req, res) {
  //criar e executar a query de leitura na BD
  const order_id = req.sanitize('order_id').escape();
  connect.con.query('DELETE iae.order, iae.ordered_product from iae.order INNER JOIN iae.ordered_product ON iae.order.order_id = iae.ordered_product.order_id where iae.order.order_id = ?', order_id, function (err, rows, fields) {
      if (!err) {
          //verifica os resultados se o número de linhas for 0 devolve dados não encontrados, caso contrário envia os resultados (rows).
          if (rows.length == 0) {
              res.status(404).send({
                  "msg": "data not found"
              });
          } else {
              res.status(200).send({
                  "msg": "success"
              });
          }
      } else
      console.log('Error while performing Query.', err);
  });
}

//FUNÇÃO PARA DEVOLVER OS VALORES DO ORDER E ORDERED_PRODUCT PELO order_id
function OrderProductedByOrderID(req, res) {
  const order_id = req.sanitize('order_id').escape();
  connect.con.query('SELECT iae.order.order_id as order_id, iae.ordered_product.description as designation_ordered_product, iae.ordered_product.order_id as order_id_ordered_product, iae.ordered_product.ordered_product_id as ordered_product_id_ordered_product, iae.ordered_product.quantity as quantity_ordered_product, iae.ordered_product.total as total_ordered_product, iae.ordered_product.unit_price as unit_price_ordered_product, iae.supplier.supplier_id as supplier_id, iae.supplier.designation as designation_supplier, iae.supplier.nif as nif_supplier, iae.supplier.morada as morada_supplier, iae.supplier.zip_code as zip_code_supplier, iae.supplier.district as district_supplier, iae.supplier.county as county_supplier FROM iae.order LEFT JOIN iae.supplier ON iae.order.supplier_id = iae.supplier.supplier_id LEFT JOIN iae.ordered_product ON iae.ordered_product.order_id = iae.order.order_id WHERE iae.order.order_id = ? group by iae.ordered_product.ordered_product_id', order_id, function(error, result) {
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}



//FUNÇÃO PARA DEVOLVER OS VALORES DO ORDER E SUPPLIER PELO order_id
function OrderSupplierByOrderID(req, res) {
  const order_id = req.sanitize('order_id').escape();
  connect.con.query('SELECT iae.order.order_id as order_id, iae.order.date as date_order, iae.order.expire_date as expire_date_order, iae.order.total as total_order, iae.order.document_id as document_id_order, iae.order.status_payment as status_payment, iae.supplier.supplier_id as supplier_id, iae.supplier.designation as designation_supplier, iae.supplier.nif as nif_supplier, iae.supplier.morada as morada_supplier, iae.supplier.zip_code as zip_code_supplier, iae.supplier.district as district_supplier, iae.supplier.county as county_supplier FROM iae.order LEFT JOIN iae.supplier ON iae.order.supplier_id = iae.supplier.supplier_id WHERE iae.order.order_id = ? group by iae.order.order_id', order_id, function(error, result) {
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}



//FUNÇÃO PARA DEVOLVER OS VALORES DO ORDER E ORDERED_PRODUCT COM O MESMO order_id
function SupplierByID(req, res) {
  const supplier_id = req.sanitize('supplier_id').escape();
  connect.con.query('SELECT * FROM iae.supplier WHERE supplier_id = ?', supplier_id, function(error, result) {
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}



//FUNÇÃO PARA CONTAR O NUMERO DE NOTAS DE ENCOMENDA SEM O ASSOCIATED DOCUMENTS
function CountOrderwithoutAssociatedDocuments(req, res){
  var options =new URL("http://localhost:4444/PuchaseOrderGetAll");
  
  http.request(options, function(response) {
    var respon='';
    //RECEBER OS DADOS E ENVIAR PARA A CALLBACK
    response.on('data', function (chunk) {
      respon+=chunk;
    });
    //RESPOSTA NO FINAL   
    response.on('end', function() {
      //PEGAR NOS DADOS E PASSAR PARA JSON
      var json_moloni_res=JSON.parse(respon);

      //CRIAR ARRAY DE DOCUMENT ID SEM ASSOCIATED
      var documents_array=[];
      for (let i = 0; i < json_moloni_res.length; i++) {
          
        if(json_moloni_res[i].reverse_associated_documents.length==0){
          documents_array.push(json_moloni_res[i].document_id);
        }
        
      }
      connect.con.query('SELECT count(iae.order.order_id) as count FROM iae.order WHERE iae.order.document_id IN ('+documents_array+')', function(error, result){
        //caso de erro ,manda msg de erro
        if (error){
          //ENVIAR STATUS DE ERRO
          res.status(400).send({
            "msg": "Error, something went wrong"
        });
        //PRINTAR NA CONSOLA ERRO
          return console.error(error);
        }else{
        //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
        console.log(result);
        res.send(result);
        }
    });



    });
  
  }).end();
  
}


//FUNÇÃO PARA FAZER GET DOS DADOS DO SUPPLIER ID COM MAIS NOTAS DE ENCOMENDA
function GetOrdersWithSupplierMostMention(req,res){
  connect.con.query('SELECT  (select round(sum(iae.order.total), 2) from iae.order) as total_order, iae.supplier.designation as supplier_designation, iae.order.order_id, iae.order.supplier_id, iae.order.date, iae.order.expire_date, iae.order.total, iae.order.document_id FROM iae.order left join iae.supplier on iae.order.supplier_id = iae.supplier.supplier_id WHERE iae.order.supplier_id = (SELECT iae.order.supplier_id FROM iae.order GROUP BY iae.order.supplier_id ORDER BY COUNT(*) DESC LIMIT 1) and str_to_date(iae.order.date, "%d-%m-%Y") between DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()', function (error, result){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}


//FUNÇÃO PARA FAZER O GET DOS 3 PRODUTOS MAIS ADQUIRIDOS NOS ULTIMOS 30 DIAS
function Get3TopSuppliesInLast30Days(req,res){
  connect.con.query('select iae.ordered_product.description, count(iae.ordered_product.description) as number from iae.ordered_product LEFT JOIN iae.order ON iae.ordered_product.order_id = iae.order.order_id WHERE iae.ordered_product.description != "Transporte km" and str_to_date(iae.order.date, "%d-%m-%Y") between DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW() group by iae.ordered_product.description order by number DESC limit 3 ', function (error, result){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}

//FUNÇÃO PARA FAZER O CONTAR O TOTAL GASTO NUM MÊS (TOTAL DO VALOR DAS ORDERS DO MES CORRENTE, TODOS OS SUPPLIERS)
function GetTotalCostInCurrentMonth(req,res){
  connect.con.query('SELECT round(sum(iae.order.total), 2) as total_cost FROM iae.order WHERE month(str_to_date(iae.order.date, "%d-%m-%Y")) = month(now()) and year(str_to_date(iae.order.date, "%d-%m-%Y")) = year(now())', function (error, result){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}


//FUNÇÃO PARA FAZER O CONTAR O TOTAL GASTO NUM MÊS (TOTAL DO VALOR DAS ORDERS DO MES CORRENTE, TODOS OS SUPPLIERS)
function GetTotalNumberofOrdersInCurrentMonth(req,res){
  connect.con.query('SELECT COUNT(iae.order.order_id) as total_cost FROM iae.order WHERE month(str_to_date(iae.order.date, "%d-%m-%Y")) = month(now()) and year(str_to_date(iae.order.date, "%d-%m-%Y")) = year(now())', function (error, result){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}


//FUNÇÃO PARA FAZER O COUNT DO NUMERO DE ORDERS COM STATUS_PAYMENT PENDING
function CountPaymentStatusPending(req,res){
  connect.con.query('SELECT COUNT(iae.order.order_id) as total FROM iae.order WHERE iae.order.status_payment = "Pending"', function (error, result){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}



//FUNÇÃO PARA FAZER UPDATE DO STATUS PAYMENT
function PutPaymentStatusPending(req,res){
  //parametros
  const order_id = req.sanitize('order_id').escape();
  const status_payment = req.sanitize('status_payment').escape();

  connect.con.query('UPDATE iae.order SET iae.order.status_payment = ? WHERE order_id = ?', [status_payment, order_id], function (error, result, fields){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log('UPDATE COM SUCESSO');
    res.send('UPDATE COM SUCESSO');
    }
});
}


//FUNÇÃO PARA FAZER O CONTAR O TOTAL GASTO NO MÊS ATUAL E O MÊS ANTERIOR (TOTAL DO VALOR DAS ORDERS DO MES CORRENTE, TODOS OS SUPPLIERS)
function GetTotalCostInCurrentAndLastMonth(req,res){
  connect.con.query('SELECT (SELECT round(sum(iae.order.total), 2) FROM iae.order WHERE month(str_to_date(iae.order.date, "%d-%m-%Y")) = month(current_date - interval 1 month) and year(str_to_date(iae.order.date, "%d-%m-%Y")) = year(current_date - interval 1 month)) as total_cost_previous_month, round(sum(iae.order.total), 2) as total_cost_current_year FROM iae.order WHERE month(str_to_date(iae.order.date, "%d-%m-%Y")) = month(now()) and year(str_to_date(iae.order.date, "%d-%m-%Y")) = year(now())', function (error, result){
    //caso de erro ,manda msg de erro
    if (error){
      //ENVIAR STATUS DE ERRO
      res.status(400).send({
        "msg": "Error, something went wrong"
    });
    //PRINTAR NA CONSOLA ERRO
      return console.error(error);
    }else{
    //CASO DE CERTO , PRINTAR ERRO E MANDAR O ERRO
    console.log(result);
    res.send(result);
    }
});
}


module.exports = {
    read: read,
    GetOrderId: GetOrderId,
    OrderProductByID: OrderProductByID,
    GetSuppliers: GetSuppliers,
    saveOrder: saveOrder,
    InsertOrdered: InsertOrdered,
    InsertOrderedArray:InsertOrderedArray,
    DeleteOrderID: DeleteOrderID,
    OrderProductedByOrderID: OrderProductedByOrderID,
    OrderSupplierByOrderID: OrderSupplierByOrderID,
    SupplierByID: SupplierByID,
    CountOrderwithoutAssociatedDocuments: CountOrderwithoutAssociatedDocuments,
    GetOrdersWithSupplierMostMention: GetOrdersWithSupplierMostMention,
    Get3TopSuppliesInLast30Days: Get3TopSuppliesInLast30Days,
    GetTotalCostInCurrentMonth: GetTotalCostInCurrentMonth,
    GetTotalNumberofOrdersInCurrentMonth: GetTotalNumberofOrdersInCurrentMonth,
    CountPaymentStatusPending: CountPaymentStatusPending,
    PutPaymentStatusPending: PutPaymentStatusPending,
    GetTotalCostInCurrentAndLastMonth: GetTotalCostInCurrentAndLastMonth,
}