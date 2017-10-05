'use strict';
/**
 * Liqpay Payment Module
 *
 * NOTICE OF LICENSE
 *
 * This source file is subject to the Open Software License (OSL 3.0)
 * that is available through the world-wide-web at this URL:
 * http://opensource.org/licenses/osl-3.0.php
 *
 * @category        LiqPay
 * @package         liqpay/liqpay
 * @version         3.0
 * @author          Liqpay
 * @copyright       Copyright (c) 2014 Liqpay
 * @license         http://opensource.org/licenses/osl-3.0.php Open Software License (OSL 3.0)
 *
 * EXTENSION INFORMATION
 *
 * LIQPAY API       https://www.liqpay.com/ru/doc
 *
 */
var request = require('request');
var crypto  = require('crypto');
var base64 = require('js-base64').Base64;
var Promise = require("bluebird");


/**
 * Constructor.
 *
 * @param public_key
 * @param private_key
 * @param sandbox optional - true/false
 * @throws InvalidArgumentException
 */
module.exports = function(public_key, private_key, sandbox) {

  // API host
  this.host = "https://www.liqpay.com/api/";

  /**
   * Call API
   *
   * @param string $path
   * @param Object $params
   * @param function $callback
   *
   * @return Object
   */
  this.api = function(path, params, callback, callbackerr){

    if(!params.version)
      throw new Error('version is null');

    params.public_key = public_key;
    var data = new Buffer(JSON.stringify(params)).toString('base64');
    var signature = this.str_to_sign(private_key + data + private_key);

    request.post(this.host + path, { form: {data : data, signature : signature}}, function (error, response, body) {
        if (!error && response.statusCode == 200) {
          callback( JSON.parse(body) )
        }else{
          callbackerr(error, response);
        }
      }
    );
  };
  /**
   * getDataAndSignatureForForm
   *
   * @param amount required  Сумма платежа.
   *  @param currency default - UAH
   *  @param order_id required Уникальный ID покупки в Вашем магазине.
   *  @param description required Описание покупки.
   *  @param type default - buy
   *  @param server_url optional - URL API в Вашем магазине для уведомлений о изменении статуса платежа (сервер->сервер).
   *  Есть возможность настроить в личном кабинете.
   *  @param result_url optional - URL в Вашем магазине на который покупатель будет переадресован после завершения покупки.
   *  Есть возможность настроить в личном кабинете.
   *  @param pay_way default - liqpay
   *  @param language default - ru
   *  @param version required Версия API. default - 3
   *
   * @throws InvalidArgumentException
   */

   this.getDataAndSignatureForForm = function(amount, order_id, description, pay_way, server_url, result_url,
                                             currency, type, language, version) {
    var params = {
      version: version || "3",
      public_key: public_key,
      amount: amount,
      currency: currency || "UAH",
      description: description || "Оплата",
      order_id: order_id,
      type: type || "buy",
      language: language || "ru",
      pay_way: pay_way || "liqpay",
      server_url: server_url || "",
      result_url: result_url || ""
    };
    if(sandbox){params.sandbox = 1}
    params = this.cnb_params(params);
    var data = new Buffer(JSON.stringify(params)).toString('base64');
    var signature = this.str_to_sign(private_key + data + private_key);
    return {
      signature: signature,
      data: data
    }
  };

  this.checkSignature = function(signature, params) {
    var correctSignature = false;
    if(signature == this.str_to_sign(private_key + params + private_key)) {
      correctSignature = true;
    }
    return correctSignature;
  };

  this.getCallbackData = function (signature, params) {
    var this_ = this;
    return new Promise(function(resolve, reject) {
      if (this_.checkSignature(signature, params)) {
        resolve(JSON.parse(base64.decode(params)));
      } else {
        reject('Incorrect signature');
      }
    });
  };

  this.checkPayment = function(order_id, version) {
    var this_ = this;
    return new Promise(function(resolve, reject){
      this_.api("payment/status", {
        "version"  : version || "3",
        "order_id" : order_id
      }, function(json){
        resolve(json);
      });
    });
  };

  this.cnb_form = function(params){

    var language = "ru";
    if(params.language)
      language = params.language;

    params = this.cnb_params(params);
    var data = new Buffer(JSON.stringify(params)).toString('base64');
    var signature = this.str_to_sign(private_key + data + private_key);

    return '<form method="POST" action="https://www.liqpay.com/api/checkout" accept-charset="utf-8">' +
      '<input type="hidden" name="data" value="'+data+'" />' +
      '<input type="hidden" name="signature" value="'+signature+'" />' +
      '<input type="image" src="//static.liqpay.com/buttons/p1'+language+'.radius.png" name="btn_text" />' +
      '</form>';

  };


  /**
   * cnb_signature
   *
   * @param params
   *
   * @return string
   *
   * @throws InvalidArgumentException
   */
  this.cnb_signature = function(params){

    params = this.cnb_params(params);
    var data = new Buffer(JSON.stringify(params)).toString('base64');
    return this.str_to_sign(private_key + data + private_key);

  };


  /**
   * cnb_params
   *
   * @param Object $params
   *
   * @return Object $params
   *
   * @throws InvalidArgumentException
   */
  this.cnb_params = function(params){

    params.public_key = public_key;

    if(!params.version)
      throw new Error('version is null');
    if(!params.amount)
      throw new Error('amount is null');
    if(!params.currency)
      throw new Error('currency is null');
    if(!params.description)
      throw new Error('description is null');

    return params;

  };


  /**
   * str_to_sign
   *
   * @param string $str
   *
   * @return string
   */
  this.str_to_sign = function(str){
    var sha1 = crypto.createHash('sha1');
    sha1.update(str);
    return sha1.digest('base64');
  };

  return this;
};