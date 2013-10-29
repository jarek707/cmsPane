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

    public function genSql($tab, $isInsert) {
        $ret = array(); $val = $cols = $upd = '';

        if ($res = $this->query($sql = "SHOW COLUMNS FROM `$tab`"))
            while( $obj = $res->fetch_object() )
                if (!in_array($obj->Field, array('id', 'user_id'))) {
                    $cols .= ',`'  . $obj->Field . '`';
                    $vals .= ",'$" . $obj->Field . "'";
                    $upd  .= ",`"  . $obj->Field . "`=" . "'$" . $obj->Field . "'";
                }

        return $isInsert 
            ? '"INSERT INTO `' . $tab . '` (' . substr($cols, 1) . ") VALUES (" . substr($vals, 1) . ')"'
            : '"UPDATE `' . $tab . '` SET ' . substr($upd, 1) . ' WHERE id=$rowId"';
    }

    public function update($tab, $rowId,  $data) {
        foreach($data as $key => $val) {
            $data[$key] = filter_var($val, FILTER_SANITIZE_STRING);
        }

        extract($data);

        eval('$sql=' . $this->genSql($tab, $rowId < 0) . ';');
        $this->query($sql);

        return array($data, $sql, $this->error);
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


    public function getAll($tab, $rel, $pid) {
        $out = array();

        $where = $pid > 0 ? "WHERE pid=$pid" : '';
        if ($res = $this->query($sql = "SELECT * FROM $tab $where"))
            while( $obj = $res->fetch_object() )
                $out[$obj->id] = $rel ? json_decode($obj->rel) : $obj;

        return $out;
    }

    public function delete($tab, $rowId) {
        $this->query($sql = "DELETE FROM `$tab` WHERE id=$rowId");

        return array($this->error, $sql);
    }
}
header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
header('Pragma: no-cache'); // HTTP 1.0.
header('Expires: 0'); // Proxies.

if ($_SERVER['HTTP_HOST'] === 'cms') {
    $dbHost = 'localhost';
} else {
    $dbHost = 'kodemaistercom.ipagemysql.com';
}

$db = new db($dbHost, 'club', 'club_99','club');

$tab   = $_GET['table'];
$rowId = intval($_GET['rowId']);
$pid   = intval($_GET['pid']);
$rel   = isset($_GET['rel']);

switch ($_GET['action']) {
    case 'schema' : $ret = $db->genCols($tab);          break;
    case 'get'    : $ret = $db->getAll($tab, $rel, $pid);     break;
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
