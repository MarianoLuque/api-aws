'use strict';
const { v4 } = require("uuid");
const AWS = require("aws-sdk");
const querystring = require("querystring")

module.exports.createUser = async (event) => {
  const body = querystring.parse(event["body"])
  
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: `Creando usuarios`,
        input: `Hola ${body.user}`,
      },
      null,
      2
    ),
  };
};

module.exports.getCategorias = async (event) => {
  try{
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const result = await dynamodb.scan({ TableName: "CategoriasTable" }).promise();

    const categorias = result.Items;

    return {
      status: 200,
      body: {
        categorias,
      },
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Algo salio mal",
    };
  }
};

module.exports.getCategoria = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { id } = event.pathParameters;

    const result = await dynamodb
      .get({
        TableName: "CategoriasTable",
        Key: { id },
      })
      .promise();

    const categoria = result.Item;

    return {
      status: 200,
      body: categoria,
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Algo salio mal",
    };
  }
};

module.exports.createCategoria = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();

    const { nombre } = event.body;
    const id = v4();
  
    console.log("created id: ", id);
  
    const newCategoria = {
      id,
      nombre,
    };
  
    await dynamodb
      .put({
        TableName: "CategoriasTable",
        Item: newCategoria,
      })
      .promise();
  
    return {
      statusCode: 200,
      body: JSON.stringify(newCategoria),
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Algo salio mal",
    };
  }
};

module.exports.updateCategoria = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;

    const { nombre } = JSON.parse(event.body);

    await dynamodb
      .update({
        TableName: "CategoriasTable",
        Key: { id },
        UpdateExpression: "set nombre = :nombre",
        ExpressionAttributeValues: {
          ":nombre": nombre,
        },
        ReturnValues: "ALL_NEW",
      })
      .promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "category updated",
      }),
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Algo salio mal",
    };
  }
};

module.exports.deleteCategoria = async (event) => {
  try {
    const dynamodb = new AWS.DynamoDB.DocumentClient();
    const { id } = event.pathParameters;
  
    await dynamodb
      .delete({
        TableName: "CategoriasTable",
        Key: {
          id,
        },
      })
      .promise();
  
    return {
      status: 200,
      body: {
        message: 'Deleted category'
      }
    };
  } catch (error) {
    console.log(error)
    return {
      status: 500,
      message: "Algo salio mal",
    };
  }
};