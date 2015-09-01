<?php
namespace CRUD\RESTful;
use Pux\Mux;
use Pux\Controller\RESTfulController;
use LogicException;

class ResourceHandler extends RESTfulController
{
    public $recordClass;

    public function createCollection()
    {
        return $this->createModel()->asCollection();
    }

    public function createModel()
    {
        if (!$this->recordClass) {
            throw new LogicException(get_class($this) . ":recordClass is not defined.");
        }
        return new $this->recordClass;
    }

    public function loadRecord($id)
    {
        $record = $this->createModel();
        $ret = $record->load($id);
        $this->checkRecordResult($ret);
        return $record;
    }

    public function checkRecordResult($result) 
    {
        if ( ! $result->success ) {
            $this->codeForbidden();
            die($result->message);
        }
    }

    /**
     * retrieve record list
     */
    public function find() {
        $collection = $this->createCollection();
        // $count = $collection->queryCount();
        if ( isset( $_GET['page'] ) ) {
            $collection->page( $_GET['page'] );
        }
        return $collection->toArray();
    }

    /**
     * create new record
     */
    public function createAction()
    {
        return [200, ['Content-Type: application/json;'], json_encode([ 'action' => 'create' ])];
    }

    /**
     * delete record
     */
    public function deleteAction($id)
    {
        return [200, ['Content-Type: application/json;'], json_encode([ 'action' => 'delete' ])];
    }

    public function collectionAction()
    {
        $collection = $this->createCollection();
        return [200, ['Content-Type: application/json;'], json_encode($collection->toArray(), JSON_PRETTY_PRINT)];
    }


    /**
     * update record 
     */
    public function updateAction($id)
    {
        $record = $this->loadRecord($id);
        $put = $this->parseInput();
        $ret = $record->update($put);
        $this->checkRecordResult($ret);
        // return $record->toArray();
        return [200, [], json_encode([ 'action' => 'delete' ])];
    }

    public function loadAction($id)
    {
        $record = $this->loadRecord($id);
        // return $record->toArray();
        return [200, [], json_encode([ 'action' => 'delete' ])];
    }
}


