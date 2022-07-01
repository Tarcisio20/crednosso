<?php
use core\Router;

$router = new Router();

$router->get('/', 'HomeController@index');

// ROTAS DE SHIPPING
$router->get('/shipping', 'ShippingController@index');
$router->get('/shipping/add', 'ShippingController@add');
$router->post('/shipping/add', 'ShippingController@addAction');
$router->get('/shipping/edit/{id}', 'ShippingController@edit');
$router->post('/shipping/edit/{id}', 'ShippingController@editAction');
$router->get('/shipping/disable/{id}', 'ShippingController@disable');
$router->get('/shipping/enable/{id}', 'ShippingController@enable');
// FIM DAS ROTAS DE SHIPPING

// ROTAS DE TESOURARIA
$router->get('/treasury', 'TreasuryController@index');
$router->get('/treasury/add/{id}', 'TreasuryController@add');
$router->post('/treasury/add/{id}', 'TreasuryController@addAction');

// ROTAS DE CONTESTACOES
$router->get('/contestation', 'ContestationController@index');
$router->get('/contestation/add', 'ContestationController@add');
$router->post('/contestation/add', 'ContestationController@addAction');
$router->get('/contestation/view/{text}', 'ContestationController@view');
$router->get('/contestation/edit/{id}', 'ContestationController@edit');
$router->post('/contestation/edit/{id}', 'ContestationController@editAction');
$router->get('/contestation/disable/{id}', 'ContestationController@disable');
$router->get('/contestation/enable/{id}', 'ContestationController@enable');

// FIM DAS ROTAS DE CONTESTAÇOES

// ROTAS DE LOTE
$router->get('/batch', 'BatchController@index');
$router->get('/batch/view/{id}', 'BatchController@view');
$router->post('/batch/view/', 'BatchController@viewAction');
$router->get('/batch/search/{batch}', 'BatchController@search');
// FIM DAS ROTAS DE LOTE

// ROTAS DE ATM
$router->get('/atm', 'AtmController@index');
$router->get('/atm/add', 'AtmController@add');
$router->post('/atm/add', 'AtmController@addAction');
$router->get('/atm/edit/{id}', 'AtmController@edit');
$router->post('/atm/edit/{id}', 'AtmController@editAction');
$router->get('/atm/enable/{id}', 'AtmController@enable');
$router->get('/atm/disable/{id}', 'AtmController@disable');

//FIM DAS ROTAS DE ATM

// ROTAS DE PEDIDOS
$router->get('/request', 'RequestController@index');
$router->get('/request/add', 'RequestController@add');
$router->post('/request/add', 'RequestController@addAction');
$router->get('/request/search', 'RequestController@search');
$router->post('/request/search', 'RequestController@searchAction');
$router->post('/request/new_date', 'RequestController@newDate');
//$router->get('/request/functions/launch_action/{ids}', 'RequestController@launch');
$router->post('/request/functions/launch_action', 'RequestController@launchAction');
$router->post('/request/functions/generate_pdf', 'RequestController@generatePDF');
$router->get('/request/view/{id}', 'RequestController@view');
$router->post('/request/view/edit/{id}', 'RequestController@editAction');
$router->post('/request/search/partial', 'RequestController@partialAction');
$router->post('/request/search/ajax', 'RequestController@searchAjaxAction');

// ROTAS SALARIO
$router->get('/request/payment', 'RequestController@payment');
$router->get('/request/payment/add', 'RequestController@paymentAdd');
$router->post('/request/payment/add', 'RequestController@paymentAddAction');
$router->get('/request/payment/edit/{id}', 'RequestController@paymentEdit');
$router->post('/request/payment/edit/{id}', 'RequestController@paymentEditAction');
// ROTAS FERIAS
$router->get('/request/payment_vacation', 'RequestController@paymentVacation');
$router->get('/request/payment_vacation/add', 'RequestController@paymentVacationAdd');
$router->post('/request/payment_vacation/add', 'RequestController@paymentVacationAddAction');
$router->get('/request/payment_vacation/edit/{id}', 'RequestController@paymentVacationEdit');
$router->post('/request/payment_vacation/edit/{id}', 'RequestController@paymentVacationEditAction');

// ROTAS DE PDF
$router->get('/request/pdf/view/{integrity}', 'RequestController@viewPDF');
$router->get('/request/pdf/download_all/{integrity}', 'RequestController@downloadAllPDF');
$router->get('/request/pdf/download_one/{id}', 'RequestController@downloadOnePDF');
$router->get('/request/pdf/report/{ids}', 'RequestController@report');
$router->get('/request/pdf/download_excel', 'RequestController@downloadExcel');
$router->get('/request/pdf/download_one_paymment/{id}', 'RequestController@downloadOnePaymment');
$router->get('/request/pdf/paymment/{ids}', 'RequestController@generatePaymment');
// FIM DAS ROTAS DE PEDIDO
$router->get('/supplie', 'SupplieController@index');
$router->post('/supplie/view', 'SupplieController@viewAction');
$router->get('/supplie/view/{id}', 'SupplieController@viewActionGet');
$router->post('/supplie/view/{id}', 'SupplieController@viewActionPost');
$router->post('/supplie/cancel', 'SupplieController@cancel');
$router->post('/supplie/devide', 'SupplieController@devide');
$router->get('/supplie/screen/{date}', 'SupplieController@screen');

$router->post('/supplie/screen/individual_cancel', 'SupplieController@cancelIndividual');



$router->get('/region', 'RegionController@index');
$router->get('/region/add', 'RegionController@add');
$router->post('/region/add', 'RegionController@addAction');
$router->get('/region/edit/{id}', 'RegionController@edit');
$router->post('/region/edit/{id}', 'RegionController@editAction');
$router->get('/region/disable/{id}', 'RegionController@disable');
$router->get('/region/enable/{id}', 'RegionController@enable');

$router->get('/gmcore', 'GmcoreController@index');
$router->get('/gmcore/add', 'GmcoreController@add');
$router->post('/gmcore/add', 'GmcoreController@addAction');
$router->get('/gmcore/edit/{id}', 'GmcoreController@edit');
$router->post('/gmcore/edit/{id}', 'GmcoreController@editAction');
$router->get('/gmcore/disable/{id}', 'GmcoreController@disable');
$router->get('/gmcore/enable/{id}', 'GmcoreController@enable');

$router->get('/gmcore/company', 'GmcoreController@company');
$router->get('/gmcore/company/add', 'GmcoreController@addCompany');
$router->post('/gmcore/company/add', 'GmcoreController@addCompanyAction');
$router->get('/gmcore/company/edit/{id}', 'GmcoreController@editCompany');
$router->post('/gmcore/company/edit/{id}', 'GmcoreController@editCompanyAction');
$router->get('/gmcore/company/disable/{id}', 'GmcoreController@disableCompany');
$router->get('/gmcore/company/enable/{id}', 'GmcoreController@enableCompany');

$router->get('/config', 'ConfigController@index');
$router->get('/config/log_teasury', 'ConfigController@logTeasury');
$router->post('/config/log_teasury', 'ConfigController@logTeasuryAction');
$router->get('/config/log_teasury/add', 'ConfigController@logTeasuryAdd');
$router->post('/config/log_teasury/add', 'ConfigController@logTeasurySddAction');
$router->get('/config/log_teasury/search', 'ConfigController@logTeasurySearch');
$router->get('/config/supplie', 'ConfigController@supplieStatus');
$router->get('/config/supplie/add', 'ConfigController@supplieStatusAdd');
$router->post('/config/supplie/add', 'ConfigController@supplieStatusAddAction');
$router->get('/config/request', 'ConfigController@requestStatus');
$router->get('/config/request/add', 'ConfigController@requestStatusAdd');
$router->post('/config/request/add', 'ConfigController@requestStatusAddAction');
$router->get('/config/order', 'ConfigController@orderStatus');
$router->get('/config/order/add', 'ConfigController@orderStatusAdd');
$router->post('/config/order/add', 'ConfigController@orderStatusAddAction');
$router->get('/config/operation_type', 'ConfigController@operationType');
$router->get('/config/operation_type/add', 'ConfigController@operationTypeAdd');
$router->post('/config/operation_type/add', 'ConfigController@operationTypeAddAction');
$router->get('/config/batch_types', 'ConfigController@batchTypes');
$router->get('/config/batch_types/add', 'ConfigController@batchTypesAdd');
$router->post('/config/batch_types/add', 'ConfigController@batchTypesAddAction');
$router->get('/config/batch_status', 'ConfigController@batchStatus');
$router->get('/config/batch_status/add', 'ConfigController@batchStatusAdd');
$router->post('/config/batch_status/add', 'ConfigController@batchStatusAddAction');
$router->get('/config/atm_types', 'ConfigController@atmTypes');
$router->get('/config/atm_types/add', 'ConfigController@atmTypesAdd');
$router->post('/config/atm_types/add', 'ConfigController@atmTypesAddAction');
$router->get('/config/shipping_types', 'ConfigController@shippingTypes');
$router->get('/config/shipping_types/add', 'ConfigController@shippingTypesAdd');
$router->post('/config/shipping_types/add', 'ConfigController@shippingTypesAddAction');

//$router->get('/sobre/{nome}', 'HomeController@sobreP');