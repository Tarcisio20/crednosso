<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Shipping_gmcore as Gmcore;
use \src\models\Shipping_gmcore_company as GmcoreCompanys;

class GmcoreController extends Controller {

    public function index() {
        $gmcores = Gmcore::select()->orderBy('id_gmcore', 'asc')->execute();
        if(count($gmcores) == 0){
            $gmcores = null;
        }else{
            foreach($gmcores as $key => $gmcore){
                $companys = GmcoreCompanys::select()
                ->where('id_company', $gmcore['id_company'])->execute();
                $gmcores[$key]['name_company'] = (count($companys) == 0)?null:$companys[0]['name'];
            }
        }

        $this->render('gmcore' , [
            'title_page' => 'Gmcore',
            'gmcores' => $gmcores
        ]);
    }

    public function add() {

        $companys = GmcoreCompanys::select()->where('status', 'Y')->execute();
        if(count($companys) == 0){
            $companys = null;
        }

        $this->render('/gmcore/gmcore_add' , [
            'title_page' => 'Adicionar Filial Gmcore',
            'companys' => $companys
        ]);
    }

    public function addAction() {
        $id_gmcore = filter_input(INPUT_POST, 'id_gmcore');
        $name_gmcore = filter_input(INPUT_POST, 'name_gmcore');
        $id_company = filter_input(INPUT_POST, 'id_company');

        if($id_gmcore && $name_gmcore && $id_company){
            $verifyIDGMCORE = Gmcore::select()->where('id_gmcore', $id_gmcore)->execute();
            if(count($verifyIDGMCORE) == 0){
                $verifyNAMEGMCORE = Gmcore::select()->where('name', $name_gmcore)->execute();
                if(count($verifyNAMEGMCORE) == 0){
                    $name_gmcore = strtoupper($name_gmcore);
                    Gmcore::insert([
                        'id_gmcore' => $id_gmcore,
                        'id_company' => $id_company,
                        'name' => $name_gmcore,
                        'status' => 'Y'
                    ])->execute();
                    $this->redirect('/gmcore', ['success'=>'Adicionado']);
                }
            }
        }
        $this->redirect('/gmcore/add', ['error'=>'Problemas ao salvar']);
    }

    public function edit($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore', ['error'=>'Precisamos de um ID para continuar']);
        }

        $gmcore = Gmcore::select()->where('id_gmcore', $args['id'])->execute();
        if(count($gmcore) == 0){
            $gmcore = null;
        }
        $companys = GmcoreCompanys::select()->where('status', 'Y')->execute();
        if(count($companys) == 0){
            $companys = null;
        }

        $this->render('/gmcore/gmcore_edit' , [
            'title_page' => 'Editar Filial Gmcore # ',
            'gmcore' => $gmcore,
            'companys' => $companys
        ]);
    }

    public function editAction($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore', ['error'=>'Precisamos de um ID para continuar']);
        }
        $id_gmcore = filter_input(INPUT_POST, 'id_gmcore');
        $name_gmcore = filter_input(INPUT_POST, 'name_gmcore');
        $id_company = filter_input(INPUT_POST, 'id_company');
        $status_gmcore = filter_input(INPUT_POST, 'status_gmcore');

        if($id_gmcore && $name_gmcore && $id_company){
            Gmcore::update()->set('id_gmcore', $id_gmcore)
            ->set('name', $name_gmcore)->set('id_company', $id_company)
            ->set('status', $status_gmcore)
            ->where('id_gmcore', $args['id'])->execute();

            $this->redirect('/gmcore', ['success'=>'Atualizado']);
        }

        $this->redirect('/gmcore/edit/'.$args['id'], ['error'=>'Erro ao atualizar']);
    }

    public function disable($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore', ['error'=>'Precisamos de um ID para continuar']);
        }

        Gmcore::update()->set('status', 'N')
        ->where('id_gmcore', $args['id'])->execute();

        $this->redirect('/gmcore', ['success'=>'Desabilitado']);

    }

    public function enable($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore', ['error'=>'Precisamos de um ID para continuar']);
        }

        Gmcore::update()->set('status', 'Y')
        ->where('id_gmcore', $args['id'])->execute();

        $this->redirect('/gmcore', ['success'=>'Habilitado']);

    }

    public function company(){
        $companys = GmcoreCompanys::select()->execute();
        if(count($companys) == 0){
            $companys = null;
        }

        $this->render('/gmcore/gmcore_company' , [
            'title_page' => 'Gmcore Empresas',
            'companys' => $companys
        ]);

    }

    public function addCompany(){
        $this->render('/gmcore/gmcore_company_add' , [
            'title_page' => 'Adicionar Empresa Gmcore',
        ]);
    }

    public function addCompanyAction(){
        $id_company = filter_input(INPUT_POST, 'id_company');
        $name_company = filter_input(INPUT_POST, 'name_company');
        
        if($id_company && $name_company){
            $verifyIDCOMPANY = GmcoreCompanys::select()
            ->where('id_company', $id_company)->execute();
            if(count($verifyIDCOMPANY) == 0){
                $verifyNAMECOMPANY = GmcoreCompanys::select()
                ->where('name', $name_company)->execute();
                if(count($verifyNAMECOMPANY) == 0){
                    $name_company = strtoupper($name_company);
                    GmcoreCompanys::insert([
                        'id_company' => $id_company,
                        'name' => $name_company,
                        'status' => 'Y'
                    ])->execute();
                    $this->redirect('/gmcore/campany', ['succes'=>'Adicionado']);
                }
            }
        }
        $this->redirect('/gmcore/company/add', ['error'=>'Problemas ao inserir']);
    }

    public function editCompany($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore/company', ['error'=>'Precisamos de um ID para continuar']);
        }

        $company = GmcoreCompanys::select()->where('id_company', $args['id'])->execute();
        if(count($company) == 0){
            $company = null;
        }

        $this->render('/gmcore/gmcore_company_edit' , [
            'title_page' => 'Editar Gmcore Empresas #',
            'company' => $company
        ]);

    }

    public function editCompanyAction($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore/company', ['error'=>'Precisamos de um ID para continuar']);
        }
        $id_company = filter_input(INPUT_POST, 'id_company');
        $name_company = filter_input(INPUT_POST, 'name_company');
        $status_company = filter_input(INPUT_POST, 'status_company');

        if($id_company && $name_company){
            GmcoreCompanys::update()->set('id_company', $id_company)
            ->set('name', $name_company)->set('status', $status_company)
            ->where('id_company', $args['id'])->execute();
            $this->redirect('/gmcore/company', ['success'=>'Editado']);
        }

        $this->redirect('/gmcore/company/'.$args['id'], ['error'=>'Erro ao editar']);
    }

    public function disableCompany($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore/company', ['error'=>'Precisamos de um ID para continuar']);
        }
        GmcoreCompanys::update()->set('status', 'N')->where('id_company', $args['id'])
        ->execute();

        $this->redirect('/gmcore/company');
    }

    public function enableCompany($args){
        if(!isset($args['id']) && $args['id'] == ''){
            $this->redirect('/gmcore/company', ['error'=>'Precisamos de um ID para continuar']);
        }
        GmcoreCompanys::update()->set('status', 'Y')->where('id_company', $args['id'])
        ->execute();

        $this->redirect('/gmcore/company');
    }

}