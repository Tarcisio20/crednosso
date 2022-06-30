<?php
namespace src\controllers;

use \core\Controller;
use \src\models\Image;
use \src\models\Contestation;

class ContestationController extends Controller {

    public function index() {
        $contestations = Contestation::select()->execute();

        if(count($contestations) === 0){
            $contestations = null;
        }

        $this->render('contestation' , [
            'title_page' => 'Contestações',
            'contestations' => $contestations
        ]);
    }

    public function add(){
        $this->render('/contestation/contestation_add', [
            'title_page'=>'Adicionar Contestação'
        ]);
    }

    public function addAction(){

        $num_contestation = filter_input(INPUT_POST, 'num_contestation');
        $name_contestation = filter_input(INPUT_POST, 'name_contestation');
        $card_contestation = filter_input(INPUT_POST, 'card_contestation');
        $date_contestation = filter_input(INPUT_POST, 'date_contestation');
        $type_contestation = filter_input(INPUT_POST, 'type_contestation');


        if($num_contestation && $name_contestation && $card_contestation && $date_contestation && $type_contestation ){

            if(count(Contestation::select()
                ->where('num_contest_system', $num_contestation
                )->execute()) > 0){
                    $this->redirect('/contestation/add', ['error'=>'Já existe contestação com esse numero!']);
            }

            Contestation::insert([
                "name" => $name_contestation,
                "card" => $card_contestation,
                "num_contest_system" => $num_contestation,
                "date" => $date_contestation,
                "type" => $type_contestation
            ])->execute();
            
            $id = Contestation::select('id')
            ->where('num_contest_system', $num_contestation)->execute();

            if(count($_FILES['files_contestation']['name']) > 0){
                $path = 'archives';
                $dirname = Image::generateName($id[0]['id']);
                
                $path = Image::generateDiretory($path, $dirname, 1);

                if(!is_dir($path)){
                    mkdir($path, 0777, true);
                }

                $up = Image::uploadImage($_FILES, $path);
                if(Image::verifyErrosUpload($up)){
                    foreach($up as $key => $u){
                        Image::insert([
                            'path'=>$dirname,
                            'id_contestation'=>$id[0]['id'],
                            'path_image'=> $u['name'],
                            'hash' => $u['hash']
                        ])->execute();
                    }
                }
                $this->redirect('/contestation', ['success'=>'Contestação cadastrada.']);
            }
        }


    }

    public function edit($args){
        if(!isset($args)){
            $this->redirect('/contestation', ['error'=>'Precisamos de um ID para continuar.']);
        }
        $contestation = Contestation::select()->where('id', $args['id'])->execute();
        if(count($contestation) == 0){
            $contestation = null;
        }
        $images = Image::select()->where('id_contestation', $args['id'])->where('active', 'Y')->execute();
        if(count($images) == 0){
            $images = null;
        }
        $contestation[0]['images'] = $images;
        $this->render('/contestation/contestation_edit',[
            'title_page' => 'Editar Contestação',
            'contestation' => $contestation
        ]);
    }

    public function editAction($args){
      //  if(isset($_POST['images'])){echo 'tem';}else{echo 'nao tem';};die();
        $num_contestation = filter_input(INPUT_POST, 'num_contestation');
        $name_contestation = filter_input(INPUT_POST, 'name_contestation');
        $card_contestation = filter_input(INPUT_POST, 'card_contestation');
        $date_contestation = filter_input(INPUT_POST, 'date_contestation');
        $type_contestation = filter_input(INPUT_POST, 'type_contestation');
        $status_contestation = filter_input(INPUT_POST, 'status_contestation');
        $active_contestation = filter_input(INPUT_POST, 'active_contestation');

        if($num_contestation && $name_contestation && $card_contestation && $date_contestation && 
        $type_contestation && $status_contestation && $active_contestation ){
            Contestation::update()->set('num_contest_system', $num_contestation)
            ->set('name', $name_contestation)->set('card', $card_contestation)
            ->set('date', $date_contestation)->set('type', $type_contestation)
            ->set('status', $status_contestation)->set('active', $active_contestation)
            ->where('id', $args['id'])->execute();
        }

        if(isset($_POST['images'])){
            foreach($_POST['images'] as $image){
                Image::update()->set('active', 'N')->where('id', $image)->execute();
            }
        }

        if($_FILES['files_contestation']['name'][0] !== ''){
            $path = 'archives';
            $images = Image::select()->where('id_contestation', $args['id'])->execute();
            $pathName = $images[0]['path'];

            $path = Image::generateDiretory($path, $pathName, 1);

            if(!is_dir($path)){
                mkdir($path, 0777, true);
            }
        
            $up = Image::uploadImage($_FILES, $path);
            if(Image::verifyErrosUpload($up)){
                foreach($up as $key => $u){
                    Image::insert([
                        'path'=>$pathName,
                        'id_contestation'=>$args['id'],
                        'path_image'=> $u['name'],
                        'hash' => $u['hash'],
                        'active'=>'Y'
                    ])->execute();
                }
            }
            $this->redirect('/contestation/edit/'.$args['id'], ['success'=>'Atualizado com sucesso.']);
        }
        $this->redirect('/contestation/edit/'.$args['id'], ['success'=>'Atualizado com sucesso.']);
    }

    public function view($args){
       if(!isset($args['text']) && $args['text'] == ''){
            $this->redirect('/contestation', ['error'=>'Precisamos de um argumento para continuar']);
       }
        
       
        $contestations = Contestation::select()
        ->where('name', 'LIKE', '%'.$args['text'].'%')->execute();
        if(count($contestations) == 0){
            $contestations = null;
        }
        $this->render('/contestation/contestation_view', [
            'title_page'=>'Resultado da pesquisa #'.$args['text'],
            'contestations'=>$contestations
        ]);
    }

    public function disable($args){
         if($args['id']){
            Contestation::update()
            ->set('active', 'N')
            ->where('id', $args['id'])->execute();
        }
        $this->redirect('/contestation');
    }

    public function enable($args){
         if($args['id']){
            Contestation::update()
            ->set('active', 'Y')
            ->where('id', $args['id'])->execute();
        }
        $this->redirect('/contestation');
    }

}