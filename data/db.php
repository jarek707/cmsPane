<?php
class db extends mysqli {
    public function __construct($host, $user, $pass, $db) {
        parent::init();

        if (!parent::options(MYSQLI_INIT_COMMAND, 'SET AUTOCOMMIT = 0')) {
            die('Setting MYSQLI_INIT_COMMAND failed');
        }

        if (!parent::options(MYSQLI_OPT_CONNECT_TIMEOUT, 5)) {
            die('Setting MYSQLI_OPT_CONNECT_TIMEOUT failed');
        }

        if (!parent::real_connect($host, $user, $pass, $db)) {
            die('Connect Error (' . mysqli_connect_errno() . ') '
                    . mysqli_connect_error());
        }
    }

    public function genSql($tab) {
        $ret = array(); $val = $cols = $upd = '';

        if ($res = $this->query($sql = "SHOW COLUMNS FROM `$tab`"))
            while( $obj = $res->fetch_object() )
                if (!in_array($obj->Field, array('id', 'user_id'))) {
                    $cols .= ',`'  . $obj->Field . '`';
                    $vals .= ",'$" . $obj->Field . "'";
                    $upd  .= ",`"  . $obj->Field . "`=" . "'$" . $obj->Field . "'";
                }

        $ret['insert'] = '"INSERT INTO `' . $tab . '` (' . substr($cols, 1) . ") VALUES (" . substr($vals, 1) . ')"';
        $ret['update'] = '"UPDATE `' . $tab . '` SET ' . substr($upd, 1) . ' WHERE id=$rowId"';

        return $ret;
    }

    public function update($tab, $rowId,  $data) {
        extract($data);

        $ret = $this->genSql($tab);

        eval('$sql=' . $ret[$rowId < 0 ? 'insert' : 'update'] . ';');
        $this->query($sql);

        return array($sql, $this->error);
    }

    public function updateRel($tab, $rowId, $data) {
        $data = empty($data) ? '{}' : json_encode($data);
        $numRows= mysqli_num_rows($this->query("SELECT * FROM `$tab` WHERE id=$rowId"));

        if ($numRows)  {
            $this->query($sql = "UPDATE `$tab` SET `rel` = '" . $data . "' WHERE id=$rowId");
        } else {
            $this->query($sql = "INSERT INTO `$tab` (`id`, `rel`) VALUES ($rowId, '" . $data . "')");
        }
        return array($this->error, $sql, $inData);
    }


    public function getAll($tab, $rel) {
        $out = array();

        if ($res = $this->query($sql = "SELECT * FROM $tab"))
            while( $obj = $res->fetch_object() )
                $out[$obj->id] = $rel ? json_decode($obj->rel) : $obj;

        return $out;
    }

    public function delete($tab, $rowId) {
        $this->query($sql = "DELETE FROM `$tab` WHERE id=$rowId");

        return array($this->error, $sql);
    }
}

if ($_SERVER['HTTP_HOST'] === 'cms') {
    $dbHost = 'localhost';
} else {
    $dbHost = 'kodemaistercom.ipagemysql.com';
}

$db = new db($dbHost, 'club', 'club_99','club');

$tab   = $_GET['table'];
$rowId = intval($_GET['rowId']);
$rel   = isset($_GET['rel']);

switch ($_GET['action']) {
    case 'schema' : $ret = $db->genCols($tab);          break;
    case 'get'    : $ret = $db->getAll($tab, $rel);     break;
    case 'del'    : $ret = $db->delete($tab, $rowId);   break;
    case 'post'   : 
        $ret = $rel ? $db->updateRel($tab, $rowId, $_POST)
                    : $db->update(   $tab, $rowId, $_POST);
        break;
    default: ;
}

echo json_encode($ret);

$db->close();
?>
