-- --------------------------------------------------------
-- Servidor:                     127.0.0.1
-- Versão do servidor:           10.4.22-MariaDB - mariadb.org binary distribution
-- OS do Servidor:               Win64
-- HeidiSQL Versão:              11.1.0.6116
-- --------------------------------------------------------

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET NAMES utf8 */;
/*!50503 SET NAMES utf8mb4 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


-- Copiando estrutura do banco de dados para crednosso
CREATE DATABASE IF NOT EXISTS `crednosso` /*!40100 DEFAULT CHARACTER SET utf8 */;
USE `crednosso`;

-- Copiando estrutura para tabela crednosso.atms
CREATE TABLE IF NOT EXISTS `atms` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_atm` int(11) NOT NULL,
  `id_type` int(11) DEFAULT 1,
  `id_treasury` int(11) NOT NULL DEFAULT 0,
  `name_atm` varchar(150) NOT NULL,
  `shortened_name_atm` varchar(100) NOT NULL,
  `cass_A` int(11) DEFAULT 10,
  `cass_B` int(11) DEFAULT 20,
  `cass_C` int(11) DEFAULT 50,
  `cass_D` int(11) DEFAULT 100,
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `shortened_name` (`shortened_name_atm`) USING BTREE,
  UNIQUE KEY `id_atm` (`id_atm`)
) ENGINE=InnoDB AUTO_INCREMENT=254 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.atms: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `atms` DISABLE KEYS */;
INSERT INTO `atms` (`id`, `id_atm`, `id_type`, `id_treasury`, `name_atm`, `shortened_name_atm`, `cass_A`, `cass_B`, `cass_C`, `cass_D`, `status`) VALUES
	(1, 1, 1, 2, 'SUPER COHAMA 01', 'SUP COHAMA 01', 10, 20, 50, 100, 'Y'),
	(2, 2, 1, 2, 'SUPER COHAMA 02', 'SUP COHAMA 02\r\n', 10, 20, 50, 100, 'Y'),
	(3, 3, 1, 2, 'SUPER TURU 1', 'SUPER TURU 1', 10, 20, 50, 100, 'Y'),
	(4, 4, 1, 2, 'SUPER TURU 2', 'SUPER TURU 2', 10, 20, 50, 100, 'Y'),
	(5, 5, 1, 11, 'SUPER SANTA INES 1', 'S SANTA INES 1', 10, 20, 50, 100, 'Y'),
	(6, 6, 1, 51, 'MIX MARABA 1', 'MIX MARABA 1', 10, 20, 50, 100, 'Y'),
	(7, 7, 1, 51, 'MIX MARABA 2', 'MIX MARABA 2', 10, 20, 50, 100, 'Y'),
	(8, 8, 1, 50, 'SUPER MARABA 1', 'SUPER MARABA 1', 10, 20, 50, 100, 'Y'),
	(9, 9, 1, 11, 'MIX SANTA INES 1', 'M SANTA INES 1', 10, 20, 50, 100, 'Y'),
	(10, 10, 1, 11, 'MIX SANTA INES 2', 'M SANTA INES 2', 10, 20, 50, 100, 'Y'),
	(11, 11, 1, 8, 'CALHAU 1', 'CALHAU 1', 10, 20, 50, 100, 'Y'),
	(12, 12, 1, 2, 'ATM SUPER RENASCENCA 1', 'S-RENASCENCA-1', 10, 20, 50, 100, 'N'),
	(13, 13, 1, 5, 'ATM SUPER CAPIM DOURADO 01', 'S-CAPIM DOURA-1', 10, 20, 50, 100, 'N'),
	(14, 14, 1, 8, 'MIX GUAJAJARAS 1', 'GUAJAJARAS-1', 10, 20, 50, 100, 'Y'),
	(15, 15, 1, 8, 'SUPER COHATRAC 1', 'SUP COHATRAC 1', 10, 20, 50, 100, 'Y'),
	(16, 16, 1, 8, 'MIX CURVA DO NOVENTA 1', 'M CURVA DO 90 1', 10, 20, 50, 100, 'Y'),
	(17, 17, 1, 8, 'MIX MAIOBAO 01', 'MIX MAIOBAO 01', 10, 20, 50, 100, 'Y'),
	(18, 18, 1, 2, 'MIX JOAO PAULO 1', 'JOAO PAULO-1', 10, 20, 50, 100, 'Y'),
	(19, 19, 1, 8, 'CD 02 ARMAZEM BR 1', 'CD2-1', 10, 20, 50, 100, 'Y'),
	(20, 20, 1, 8, 'MIX MAIOBAO 02', 'MIX MAIOBAO 02', 10, 20, 50, 100, 'Y'),
	(21, 21, 1, 9, 'SUPER GOIAS 01', 'SUPER GOIAS 01', 10, 20, 50, 100, 'Y'),
	(22, 22, 1, 9, 'SUPER MATEUS ACAILANDIA 1', 'S ACAILANDIA 1', 10, 20, 50, 100, 'Y'),
	(23, 23, 1, 9, 'MIX BACURI 1', 'MIX BACURI 1', 10, 20, 50, 100, 'Y'),
	(24, 24, 1, 9, 'CEARA 1', 'CEARA 1', 10, 20, 50, 100, 'Y'),
	(25, 25, 1, 9, 'MIX TAMANDARE 1', 'MIX TAMANDARE 1', 10, 20, 50, 100, 'Y'),
	(26, 26, 1, 7, 'HIPER BALSAS 1', 'HIPER BALSAS 1', 10, 20, 50, 100, 'Y'),
	(27, 27, 1, 7, 'HIPER BALSAS 2', 'HIPER BALSAS 2', 10, 20, 50, 100, 'Y'),
	(28, 28, 1, 9, 'SUPER MATEUS ACAILANDIA 2', 'S ACAILANDIA 2', 10, 20, 50, 100, 'Y'),
	(29, 29, 1, 5, 'ATM SUPER CAPIM DOURADO 02', 'S-CAPIM DOURA-2', 10, 20, 50, 100, 'N'),
	(30, 30, 1, 8, 'MIX GUAJAJARAS 2', 'GUAJAJARAS-2', 10, 20, 50, 100, 'Y'),
	(31, 31, 1, 9, 'SUPER GOIAS 02', 'SUPER GOIAS 02', 10, 20, 50, 100, 'Y'),
	(32, 32, 1, 8, 'CD 02 ARMAZEM BR 2', 'CD2-2', 10, 20, 50, 100, 'Y'),
	(33, 33, 1, 8, 'CIDADE OPERARIA 1', 'CID OPERARIA 1', 10, 20, 50, 100, 'Y'),
	(34, 34, 1, 9, 'MIX BACURI 2', 'MIX BACURI 2', 10, 20, 50, 100, 'Y'),
	(35, 35, 1, 9, 'MIX TAMANDARE 2', 'MIX TAMANDARE 2', 10, 20, 50, 100, 'Y'),
	(36, 36, 1, 2, 'COHAB 1', 'COHAB 1', 10, 20, 50, 100, 'Y'),
	(37, 37, 1, 2, 'MIX JOAO PAULO 2', 'JOAO PAULO-2', 10, 20, 50, 100, 'Y'),
	(38, 38, 1, 50, 'SUPER MARABA 2', 'SUPER MARABA 2', 10, 20, 50, 100, 'Y'),
	(39, 39, 1, 2, 'CAJAZEIRAS 1', 'CAJAZEIRAS 1', 10, 20, 50, 100, 'Y'),
	(40, 40, 1, 2, 'ATM SUPER JARACATY 1', 'S-JARACATY-1', 10, 20, 50, 100, 'N'),
	(41, 41, 1, 8, 'TURU VELHO 1', 'TURU VELHO 1', 10, 20, 50, 100, 'Y'),
	(42, 42, 1, 8, 'RIO ANIL 1', 'RIO ANIL 1', 10, 20, 50, 100, 'Y'),
	(43, 43, 1, 9, 'CD87 IMPERATRIZ 01', 'CD87-01', 20, 50, 50, 100, 'Y'),
	(44, 44, 1, 9, 'CD87 IMPERATRIZ 02', 'CD87-02', 10, 20, 50, 100, 'Y'),
	(45, 45, 1, 40, 'SUPER PARAUAPEBAS 1', 'S PARAUAPEBAS 1', 10, 20, 50, 100, 'Y'),
	(46, 46, 1, 40, 'SUPER PARAUAPEBAS 2', 'S PARAUAPEBAS 2', 10, 20, 50, 100, 'Y'),
	(47, 47, 1, 2, 'SUPER COHAMA 03', 'SUP COHAMA 03', 10, 20, 50, 100, 'Y'),
	(48, 48, 1, 8, 'PATIO NORTE 1', 'PATIO NORTE 1', 10, 20, 50, 100, 'Y'),
	(49, 49, 1, 8, 'PATIO NORTE 2', 'PATIO NORTE 2', 10, 20, 50, 100, 'Y'),
	(50, 50, 1, 8, 'RIO ANIL 2', 'RIO ANIL 2', 10, 20, 50, 100, 'Y'),
	(51, 51, 1, 8, 'BACANGA 1', 'BACANGA 1', 10, 20, 50, 100, 'Y'),
	(52, 52, 1, 8, 'BACANGA 2', 'BACANGA 2', 10, 20, 50, 100, 'Y'),
	(53, 53, 1, 9, 'ATM SHOPPING IMPERIAL 1', 'S-S.IMPERIAL-1\r\n', 10, 20, 50, 100, 'N'),
	(54, 54, 1, 9, 'ATM SHOPPING IMPERIAL 2', 'S-S.IMPERIAL-2', 10, 20, 50, 100, 'N'),
	(55, 55, 1, 9, 'CEARA 2', 'CEARA 2', 10, 20, 50, 100, 'Y'),
	(56, 56, 1, 11, 'SUPER SANTA INES 2', 'S SANTA INES 2', 10, 20, 50, 100, 'Y'),
	(57, 57, 1, 7, 'MIX BALSAS 01', 'MIX BALSAS 01', 10, 20, 50, 100, 'Y'),
	(58, 58, 1, 2, 'CAJAZEIRAS 2', 'CAJAZEIRAS 2', 10, 20, 50, 100, 'Y'),
	(59, 59, 1, 8, 'MIX CURVA DO NOVENTA 2', 'M CURVA DO 90 2', 10, 20, 50, 100, 'Y'),
	(60, 60, 1, 8, 'SUPER COHATRAC 2', 'SUP COHATRAC 2', 10, 20, 50, 100, 'Y'),
	(61, 61, 1, 8, 'CALHAU 2', 'CALHAU 2', 10, 20, 50, 100, 'Y'),
	(62, 62, 1, 2, 'ATM SUPER JARACATY 2', 'S-JARACATY-2', 10, 20, 50, 100, 'N'),
	(63, 63, 1, 8, 'TURU VELHO 2', 'TURU VELHO 2', 10, 20, 50, 100, 'Y'),
	(64, 64, 1, 2, 'COHAB 2', 'COHAB 2', 10, 20, 50, 100, 'Y'),
	(65, 65, 1, 8, 'CIDADE OPERARIA 2', 'CID OPERARIA 2', 10, 20, 50, 100, 'Y'),
	(66, 66, 1, 2, 'ATM SUPER RENASCENCA 2', 'S-RENASCENCA-2', 10, 20, 50, 100, 'N'),
	(67, 67, 1, 7, 'MIX BALSAS 02', 'MIX BALSAS 02', 10, 20, 50, 100, 'Y'),
	(68, 68, 1, 2, 'ADMINISTRATIVO COHAMA 01', 'ADM COHAMA 01', 20, 50, 50, 100, 'Y'),
	(69, 69, 1, 15, 'SHOPPING SALINAS 01', 'SHOP SALINAS 01', 10, 20, 50, 100, 'Y'),
	(70, 70, 1, 1, 'TOTEM SUPER COHAMA', 'TOTEM COHAMA', 10, 20, 50, 100, 'Y'),
	(71, 71, 1, 1, 'TOTEM SUPER BALSAS 01', 'TOTEM S BALSAS1', 10, 20, 50, 100, 'Y'),
	(72, 72, 1, 8, 'JARDIM TROPICAL 1', 'JD TROPICAL 1', 10, 20, 50, 100, 'Y'),
	(73, 73, 1, 8, 'JARDIM TROPICAL 2', 'JD TROPICAL 2', 10, 20, 50, 100, 'Y'),
	(74, 74, 1, 8, 'CD 02 ARMAZEM BR 3', 'CD2-3', 10, 20, 50, 100, 'Y'),
	(75, 75, 1, 1, 'TOTEM MIX JOAO PAULO 1', 'TOTEM J. PAULO', 10, 20, 50, 100, 'Y'),
	(76, 76, 1, 9, 'CD87 IMPERATRIZ 03', 'CD87-03', 10, 20, 50, 100, 'Y'),
	(77, 77, 1, 8, 'SHOPPING DA ILHA 1', 'SHOP DA ILHA 1', 10, 20, 50, 100, 'Y'),
	(78, 78, 1, 8, 'SHOPPING DA ILHA 2', 'SHOP DA ILHA 2', 10, 20, 50, 100, 'Y'),
	(79, 79, 1, 1, 'TOTEM MIX GUAJAJARAS 1', 'T M GUAJAJARAS', 10, 20, 50, 100, 'Y'),
	(80, 80, 1, 1, 'TOTEM S CAJAZEIRAS 1', 'T S CAJAZEIRAS', 10, 20, 50, 100, 'Y'),
	(81, 81, 1, 1, 'TOTEM CD 87 1', 'T CD87 1', 10, 20, 50, 100, 'Y'),
	(82, 82, 1, 8, 'MIX MAIOBAO 03', 'MIX MAIOBAO 03', 10, 20, 50, 100, 'Y'),
	(83, 83, 1, 40, 'SUPER PARAUAPEBAS 3', 'S PARAUAPEBAS 3', 10, 20, 50, 100, 'Y'),
	(84, 84, 1, 12, 'CD TERESINA 01', 'CD TERESINA 01', 10, 20, 50, 100, 'N'),
	(85, 85, 1, 12, 'CD TERESINA 02', 'CD TERESINA 02', 10, 20, 50, 100, 'N'),
	(86, 86, 1, 66, 'MIX TIMON 01', 'MIX TIMON 01', 10, 20, 50, 100, 'Y'),
	(87, 87, 1, 66, 'MIX TIMON 02', 'MIX TIMON 02', 10, 20, 50, 100, 'Y'),
	(88, 88, 1, 51, 'MIX MARABA 3', 'MIX MARABA 3', 10, 20, 50, 100, 'Y'),
	(89, 89, 1, 41, 'ATM SUPER JADERLANDIA 01', 'S-JARDELANDI 01', 10, 20, 50, 100, 'Y'),
	(90, 90, 1, 13, 'JADERLANDIA 02', 'JADERLANDIA 02', 10, 20, 50, 100, 'Y'),
	(91, 91, 1, 48, 'JADERLANDIA 03', 'JADERLANDIA 03', 10, 20, 50, 100, 'Y'),
	(92, 92, 1, 45, 'SUPER BELEM 01', 'SUPER BELEM 01', 10, 20, 50, 100, 'Y'),
	(93, 93, 1, 45, 'SUPER BELEM 02', 'SUPER BELEM 02', 10, 20, 50, 100, 'Y'),
	(94, 94, 1, 13, 'SUPER BELEM 03', 'SUPER BELEM 03', 10, 20, 50, 100, 'Y'),
	(95, 95, 1, 36, 'SUPER CASTANHAL 01', 'S CASTANHAL 01\r\n', 10, 20, 50, 100, 'Y'),
	(96, 96, 1, 36, 'SUPER CASTANHAL 02', 'S CASTANHAL 02', 10, 20, 50, 100, 'Y'),
	(97, 97, 1, 2, 'ATM SUPER RENASCENCA 1', 'RENASCENCA-1', 10, 20, 50, 100, 'Y'),
	(98, 98, 1, 2, 'ATM SUPER RENASCENCA 2', 'RENASCENCA-2', 10, 20, 50, 100, 'Y'),
	(99, 99, 1, 8, 'MIX GUAJAJARAS 3', 'GUAJAJARAS-3', 10, 20, 50, 100, 'Y'),
	(100, 100, 1, 36, 'SUPER CASTANHAL 03', 'S CASTANHAL 03', 10, 20, 50, 100, 'Y'),
	(101, 101, 1, 9, 'SUPER GOIAS 03', 'SUPER GOIAS 03', 10, 20, 50, 100, 'Y'),
	(102, 102, 1, 1, 'TOTEM SUPER COHAMA 02', 'TOTEM COHAMA 02', 10, 20, 50, 100, 'Y'),
	(103, 103, 1, 15, 'MESSEJANA 01', 'MESSEJANA 01', 10, 20, 50, 100, 'Y'),
	(105, 104, 1, 15, 'MESSEJANA 02', 'MESSEJANA 02', 10, 20, 50, 100, 'Y'),
	(106, 105, 1, 15, 'SHOP EUSEBIO 01', 'SHOP EUSEBIO 01', 10, 20, 50, 100, 'Y'),
	(110, 106, 1, 15, 'SHOP EUSEBIO 02', 'SHOP EUSEBIO 02', 10, 20, 50, 100, 'Y'),
	(111, 107, 1, 42, 'MIX ALTAMIRA 01', 'MIX ALTAMIRA 01', 10, 20, 50, 100, 'Y'),
	(112, 108, 1, 42, 'MIX ALTAMIRA 02', 'MIX ALTAMIRA 02', 10, 20, 50, 100, 'Y'),
	(113, 109, 1, 13, 'CD BELEM 115 01', 'CD115-BELEM-01', 10, 20, 50, 100, 'Y'),
	(114, 110, 1, 15, 'SHOPPING IANDE 01', 'SHOP IANDE 01', 10, 20, 50, 100, 'Y'),
	(115, 111, 1, 15, 'SHOPPING IANDE 02', 'SHOP IANDE 02', 10, 20, 50, 100, 'Y'),
	(116, 112, 1, 13, 'CD BELEM 115 02', 'CD115-BELEM-02', 10, 20, 50, 100, 'Y'),
	(117, 113, 1, 44, 'SUPER MAGUARI 01', 'SUPER MAGUARI 01', 10, 20, 50, 100, 'Y'),
	(118, 114, 1, 44, 'SUPER MAGUARI 02', 'SUPER MAGUARI 02', 10, 20, 50, 100, 'Y'),
	(119, 115, 1, 8, 'CD ITAPERA 01', 'CD ITAPERA 01', 10, 20, 50, 100, 'Y'),
	(123, 116, 1, 8, 'CD ITAPERA 02', 'CD ITAPERA 02', 10, 20, 50, 100, 'Y'),
	(124, 117, 1, 46, 'SUPER MARAMBAIA 01', 'S MARAMBAIA 01', 10, 20, 50, 100, 'Y'),
	(125, 118, 1, 46, 'SUPER MARAMBAIA 02', 'S MARAMBAIA 02', 10, 20, 50, 100, 'Y'),
	(126, 119, 1, 7, 'HIPER BALSAS 3', 'HIPER BALSAS 3', 10, 20, 50, 100, 'Y'),
	(127, 120, 1, 18, 'JACUNDA 01', 'JACUNDA 01', 10, 20, 50, 100, 'Y'),
	(128, 121, 1, 18, 'BRD-JACUNDA 02', 'BRD-JACUNDA 02', 10, 20, 50, 100, 'Y'),
	(129, 122, 1, 17, 'BRD-TUCUMA 02', 'BRD-TUCUMA 02', 10, 20, 50, 100, 'Y'),
	(130, 123, 1, 17, 'BRD-TUCUMA 02', 'BRD-TUCUMA 02-1', 10, 20, 50, 100, 'Y'),
	(131, 124, 1, 22, 'MIX PEDREIRAS 01', 'MIX PEDREIRAS 01', 10, 20, 50, 100, 'Y'),
	(132, 125, 1, 22, 'MIX PEDREIRAS 02', 'MIX PEDREIRAS 02', 10, 20, 50, 100, 'Y'),
	(133, 126, 1, 21, 'MIX CHAPADINHA 01', 'MIX CHAPADINHA 01', 10, 20, 50, 100, 'Y'),
	(134, 127, 1, 21, 'MIX CHAPADINHA 02', 'MIX CHAPADINHA 02', 10, 20, 50, 100, 'Y'),
	(135, 128, 1, 19, 'MIX BACABAL 01', 'BACABAL-01', 10, 20, 50, 100, 'Y'),
	(136, 129, 1, 19, 'MIX BACABAL 02', 'BACABAL-02', 10, 20, 50, 100, 'Y'),
	(137, 130, 1, 2, 'MIX JOAO PAULO 3', 'JOAO PAULO-3', 10, 20, 50, 100, 'Y'),
	(138, 131, 1, 2, 'ADMINISTRATIVO COHAMA 02', 'ADM COHAMA 02', 20, 50, 50, 100, 'Y'),
	(139, 132, 1, 2, 'SUPER COHAMA 04', 'SUP COHAMA 04', 10, 20, 50, 100, 'Y'),
	(140, 133, 1, 34, 'MIX MATEUS ABAETETUBA 01', 'ABAETETUBA 01', 10, 20, 50, 100, 'Y'),
	(141, 134, 1, 34, 'MIX MATEUS ABAETETUBA 02', 'ABAETETUBA 02', 10, 20, 50, 100, 'Y'),
	(142, 135, 1, 35, 'ATM MIX CASTANHAL 01', 'MIX CASTANHAL 1', 10, 20, 50, 100, 'Y'),
	(143, 136, 1, 35, 'ATM MIX CASTANHAL 02', 'MIX CASTANHAL 2', 10, 20, 50, 100, 'Y'),
	(144, 137, 1, 33, 'ATM MIX PINHEIRO 01', 'MIX PINHEIRO 01', 10, 20, 50, 100, 'Y'),
	(145, 138, 1, 33, 'ATM MIX PINHEIRO 02', 'MIX PINHEIRO 02', 10, 20, 50, 100, 'Y'),
	(146, 139, 1, 2, 'SUPER COHAMA 05', 'SUP COHAMA 05', 10, 20, 50, 100, 'Y'),
	(147, 140, 1, 8, 'CAMINO S J RIBAMAR 01', 'CAMINO SJR 01', 10, 20, 50, 100, 'Y'),
	(148, 141, 1, 8, 'CAMINO S J RIBAMAR 02', 'CAMINO SJR 02', 10, 20, 50, 100, 'Y'),
	(149, 142, 1, 6, 'SUPER GOIAS 04', 'SUPER GOIAS 04', 10, 20, 50, 100, 'N'),
	(150, 143, 1, 6, 'SUPER GOIAS 05', 'SUPER GOIAS 05', 10, 20, 50, 100, 'N'),
	(151, 144, 1, 8, 'MIX MAIOBAO 04', 'MIX MAIOBAO 04', 10, 20, 50, 100, 'N'),
	(152, 145, 1, 8, 'MIX MAIOBAO 05', 'MIX MAIOBAO 05', 10, 20, 50, 100, 'N'),
	(153, 146, 1, 7, 'MIX BALSAS 03', 'MIX BALSAS 03', 10, 20, 50, 100, 'Y'),
	(154, 150, 1, 19, 'BRD-BACABAL 1', 'BRD-BACABAL 1', 10, 20, 50, 100, 'Y'),
	(155, 151, 1, 21, 'BRD-CHAPADINHA 03', 'BRD-CHAPADINH 3', 10, 20, 50, 100, 'N'),
	(156, 152, 1, 9, 'MIX MATEUS ACAILANDIA 1', 'MIX ACAILANDIA1', 10, 20, 50, 100, 'Y'),
	(157, 153, 1, 9, 'MIX MATEUS ACAILANDIA 2', 'MIX ACAILANDIA2', 10, 20, 50, 100, 'Y'),
	(158, 154, 1, 26, 'BRD-NOVO COHATRAC 01', 'BRD-NOV COHA 01', 10, 20, 50, 100, 'Y'),
	(159, 155, 1, 8, 'NOVO COHATRAC 02', 'NOVOCOHATRAC 02', 10, 20, 50, 100, 'Y'),
	(160, 156, 1, 43, 'MIX ATACAREJO MARITUBA 01', 'MIX MARITUBA 01', 10, 20, 50, 100, 'Y'),
	(161, 157, 1, 43, 'MIX ATACAREJO MARITUBA 02', 'MIX MARITUBA 02', 10, 20, 50, 100, 'Y'),
	(162, 158, 1, 8, 'BRD-SUPER MATEUS ANIL 01', 'BRD-SUP ANIL 01', 10, 20, 50, 100, 'Y'),
	(163, 159, 1, 8, 'SUPER MATEUS ANIL 02', 'SUP ANIL 02', 10, 20, 50, 100, 'Y'),
	(164, 160, 1, 20, 'MIX ATACAREJO CAXIAS 01', 'MIX CAXIAS 01', 10, 20, 50, 100, 'Y'),
	(165, 161, 1, 20, 'MIX ATACAREJO CAXIAS 02', 'MIX CAXIAS 02', 10, 20, 50, 100, 'Y'),
	(166, 162, 1, 20, 'BRD-CAXIAS 03', 'BRD-CAXIAS 03', 10, 20, 50, 100, 'Y'),
	(167, 163, 1, 22, 'BRD-PEDREIRAS 03', 'BRD-PEDREIRAS 03', 10, 20, 50, 100, 'Y'),
	(168, 164, 1, 41, 'MIX PARAUAPEBAS 01', 'M PARAUAPEBAS 1', 10, 20, 50, 100, 'Y'),
	(169, 165, 1, 41, 'MIX PARAUAPEBAS 02', 'M PARAUAPEBAS 2', 10, 20, 50, 100, 'Y'),
	(170, 166, 1, 47, 'MIX INFRAERO 01', 'MIX INFRAERO 01', 10, 20, 50, 100, 'Y'),
	(171, 167, 1, 47, 'MIX INFRAERO 02', 'MIX INFRAERO 02', 10, 20, 50, 100, 'Y'),
	(172, 168, 1, 9, 'CD87 IMPERATRIZ 04', 'CD87-04', 10, 20, 50, 100, 'Y'),
	(173, 169, 1, 12, 'MIX TERESINA 01', 'MIX TERESINA 01', 10, 20, 50, 100, 'N'),
	(174, 170, 1, 12, 'MIX TERESINA 02', 'MIX TERESINA 02', 10, 20, 50, 100, 'N'),
	(175, 171, 1, 8, 'MIX ARACAGI 01', 'MIX ARACAGI 01', 10, 20, 50, 100, 'Y'),
	(176, 172, 1, 8, 'BRD -MIX ARACAGY 02', 'BRD-MIX ARACAGY', 10, 20, 50, 100, 'Y'),
	(177, 173, 1, 23, 'MIX PARNAIBA 01', 'MIX PARNAIBA 01', 10, 20, 50, 100, 'Y'),
	(178, 174, 1, 23, 'MIX PARNAIBA 02', 'MIX PARNAIBA 02', 10, 20, 50, 100, 'Y'),
	(179, 175, 1, 23, 'BRD-MIX PARNAIBA 03', 'BRD-PARNAIBA 03', 10, 20, 50, 100, 'N'),
	(180, 176, 1, 24, 'BRD-CAMINO CONCEICAO DO ARAGUAIA', 'BRD-CAMI C ARAG', 10, 20, 50, 100, 'Y'),
	(181, 177, 1, 27, 'BRD-MIX BABACULANDIA 01', 'BRD-BABACULA 01', 10, 20, 50, 100, 'Y'),
	(182, 178, 1, 27, 'MIX BABACULANDIA 02', 'MIX BABACULA 02', 10, 20, 50, 100, 'Y'),
	(183, 179, 1, 28, 'SUPER CODO 01', 'SUP CODO 01', 10, 20, 50, 100, 'Y'),
	(184, 180, 1, 28, 'BRD-SUPER CODO 02', 'BRD-SUPER CODO 02', 10, 20, 50, 100, 'Y'),
	(185, 181, 1, 29, 'CAMINO GRAJAU 01', 'CAMINO GRAJAU 01', 10, 20, 50, 100, 'Y'),
	(186, 182, 1, 8, 'MIX FORQUILHA 01', 'MIX FORQUILHA 01', 10, 20, 50, 100, 'Y'),
	(187, 183, 1, 8, 'BRD-MIX FORQUILHA 02', 'BRD-MIX FORQ 02', 10, 20, 50, 100, 'Y'),
	(188, 184, 1, 12, 'CD 101 THE - 01', 'CD 101 THE - 01', 10, 20, 50, 100, 'Y'),
	(189, 185, 1, 12, 'CD 101 THE - 02', 'CD 101 THE - 02', 10, 20, 50, 100, 'Y'),
	(190, 186, 1, 17, 'TUCUMA 03', 'TUCUMA 03', 10, 20, 50, 100, 'Y'),
	(192, 187, 1, 6, 'SUPER MATEUS ACAILANDIA 1', 'S ACAILANDIA 1-1', 10, 20, 50, 100, 'N'),
	(193, 188, 1, 6, 'SUPER MATEUS ACAILANDIA 2', 'S ACAILANDIA 2-2', 10, 20, 50, 100, 'N'),
	(194, 189, 1, 65, 'MIX TERESINA 003', 'MIX TERESINA 03', 10, 20, 50, 100, 'Y'),
	(195, 190, 1, 30, 'MIX NOVA MARABA 1', 'NOVA MARABA 1', 10, 20, 50, 100, 'Y'),
	(197, 191, 1, 30, 'BRD MIX NOVA MARABA 2', 'NOVA MARABA 2', 10, 20, 50, 100, 'Y'),
	(198, 192, 1, 31, 'SUP TAILANDIA O1', 'SUP TAILANDIA O1', 10, 20, 50, 100, 'Y'),
	(199, 193, 1, 31, 'BRD-SUP TAILANDIA 02', 'BRD-SUP TAILA 2', 10, 20, 50, 100, 'Y'),
	(200, 194, 1, 32, 'BRD-SUP COQUEIRO 01', 'BRD-SUP COQUE 1', 10, 20, 50, 100, 'Y'),
	(201, 195, 1, 32, 'SUP COQUEIRO 02', 'SUP COQUEIRO 02', 10, 20, 50, 100, 'Y'),
	(202, 196, 1, 37, 'MIX P DUTRA 1', 'MIX P DUTRA 1', 10, 20, 50, 100, 'Y'),
	(203, 197, 1, 37, 'BRD-MIX P DUTRA 2', 'BRD-MIX P DUT 2', 10, 20, 50, 100, 'Y'),
	(204, 198, 1, 38, 'SUPER BARCARENA 01', 'S BARCARENA 1', 10, 20, 50, 100, 'Y'),
	(205, 199, 1, 38, 'BRD-S BARCARENA 02', 'S BARCARENA 2', 10, 20, 50, 100, 'Y'),
	(206, 200, 1, 39, 'MIX CAPANEMA 01', 'MIX CAPANEMA 01', 10, 20, 50, 100, 'Y'),
	(207, 201, 1, 39, 'BRD-MIX CAPANEMA 02', 'MIX CAPANEMA 02', 10, 20, 50, 100, 'Y'),
	(208, 202, 1, 52, 'MIX CEASA 01', 'MIX CEASA 01', 10, 20, 50, 100, 'Y'),
	(209, 203, 1, 52, 'BRD - MIX CEASA 02', 'BRD-MIX CEASA 2', 10, 20, 50, 100, 'Y'),
	(210, 204, 1, 53, 'SUPER BARRA DO CORDA 1', 'S BARRA CORDA 1', 10, 20, 50, 100, 'Y'),
	(211, 205, 1, 53, 'BRD - SUPER BARRA DO CORDA 2', 'BRD-B CORDA 2', 10, 20, 50, 100, 'Y'),
	(212, 206, 1, 55, 'MIX REDENCAO 01', 'MIX REDENCAO 01', 10, 20, 50, 100, 'Y'),
	(213, 207, 1, 54, 'RECICLA COHAMA 06', 'RECI COHAMA 06', 10, 20, 50, 100, 'Y'),
	(214, 208, 1, 56, 'CAMINO BARREIRINHAS 01', 'BARREIRINHAS 1', 10, 20, 50, 100, 'Y'),
	(215, 209, 1, 57, 'SUPER BURITICUPU 01', 'S BURITICUPU 01', 10, 20, 50, 100, 'Y'),
	(216, 210, 1, 14, 'CD 331 SANTA ISABEL 01', 'CD331 S ISABE 1', 10, 20, 50, 100, 'N'),
	(217, 211, 1, 14, 'CD 331 SANTA ISABEL 02', 'CD331 S ISABE 2', 10, 20, 50, 100, 'N'),
	(218, 212, 1, 58, 'MIX TUCURUI 01', 'MIX TUCURUI 01', 10, 20, 50, 100, 'Y'),
	(219, 213, 1, 59, 'MIX MATEUS TIANGUA 01', 'MIX TIANGUA 01', 10, 20, 50, 100, 'Y'),
	(220, 214, 1, 14, 'CD 331 SANTA ISABEL 03', 'CD331 S ISABE 3', 10, 20, 50, 100, 'Y'),
	(221, 215, 1, 14, 'CD 331 SANTA ISABEL 04\r\n', 'CD331 S ISABE 4', 10, 20, 50, 100, 'Y'),
	(222, 216, 1, 60, 'MIX MARIO COVAS 01', 'M MARIO COVAS 1', 10, 20, 50, 100, 'Y'),
	(223, 217, 1, 61, 'MIX FLORIANO 01', 'MIX FLORIANO 01', 10, 20, 50, 100, 'Y'),
	(224, 218, 1, 62, 'MIX SOBRAL 01', 'MIX SOBRAL 01', 10, 20, 50, 100, 'Y'),
	(225, 219, 1, 8, 'CD ITAPERA 03', 'CD ITAPERA 03', 10, 20, 50, 100, 'Y'),
	(226, 220, 1, 64, 'SUPER PIRIPIRI 01', 'SUPER PIRIPIRI 01', 10, 20, 50, 100, 'Y'),
	(227, 221, 1, 2, 'ADMINISTRATIVO 02 COHAMA 01', 'ADM02 COHAMA 1', 20, 50, 50, 100, 'Y'),
	(228, 222, 1, 67, 'CD335 CABO STO AGOSTINHO 01', 'CD335 S AGOST 1', 10, 20, 50, 100, 'Y'),
	(229, 223, 1, 67, 'CD335 CABO STO AGOSTINHO 02', 'CD335 S AGOST 2', 10, 20, 50, 100, 'Y'),
	(230, 224, 1, 71, 'MIX PARAGOMINAS 01', 'M PARAGOMINAS 1', 10, 20, 50, 100, 'Y'),
	(231, 225, 1, 70, 'SUPER ESTREITO 01', 'S ESTREITO 01', 10, 20, 50, 100, 'Y'),
	(232, 226, 1, 69, 'SUPER CANAA DOS CARAJAS 01', 'SUPER CANAA 01', 10, 20, 50, 100, 'Y'),
	(233, 227, 1, 68, 'MIX BRAGANCA 01', 'MIX BRAGANCA 01', 10, 20, 50, 100, 'Y'),
	(234, 228, 1, 2, 'SUPER COHAMA 07', 'SUP COHAMA 07', 10, 20, 50, 100, 'N'),
	(235, 229, 1, 72, 'MIX TIMON ALVORADA 01', 'MIX ALVORADA 01', 10, 20, 50, 100, 'Y'),
	(236, 230, 1, 69, 'SUPER CANAA DOS CARAJAS 02', 'SUPER CANAA 02', 10, 20, 50, 100, 'Y'),
	(237, 231, 1, 68, 'MIX BRAGANCA 02', 'MIX BRAGANCA 02', 10, 20, 50, 100, 'Y'),
	(238, 232, 1, 73, 'MIX JUAZEIRO 01', 'MIX JUAZEIRO 01', 10, 20, 50, 100, 'Y'),
	(239, 233, 1, 73, 'MIX JUAZEIRO 02', 'MIX JUAZEIRO 02', 10, 20, 50, 100, 'Y'),
	(240, 234, 1, 70, 'MIX PETROLINA 01', 'MIX PETROLINA 01', 10, 20, 50, 100, 'Y'),
	(241, 235, 1, 70, 'MIX PETROLINA 02', 'MIX PETROLINA 02', 10, 20, 50, 100, 'Y'),
	(242, 236, 1, 75, 'CD 336 FEIRA DE SANTANA 01', 'CD336 SANTANA 1', 10, 20, 50, 100, 'Y'),
	(243, 237, 1, 75, 'CD 336 FEIRA DE SANTANA 02', 'CD336 SANTANA 2', 10, 20, 50, 100, 'Y'),
	(244, 238, 1, 8, 'MIX MAIOBAO UBATUBA 01', 'MIX UBATUBA 01', 10, 20, 50, 100, 'Y'),
	(245, 239, 1, 8, 'MIX MAIOBAO UBATUBA 02', 'MIX UBATUBA 02', 10, 20, 50, 100, 'Y'),
	(246, 240, 1, 76, 'MIX MATEUS BENGUI 01', 'MIX BENGUI 01', 10, 20, 50, 100, 'Y'),
	(247, 241, 1, 76, 'MIX MATEUS BENGUI 02', 'MIX BENGUI 02', 10, 20, 50, 100, 'Y'),
	(248, 242, 1, 77, 'MIX TEIXEIRA DE FREITAS 01', 'MIX TEIXEIRA 01', 10, 20, 50, 100, 'Y'),
	(249, 243, 1, 77, 'MIX TEIXEIRA DE FREITAS 02', 'MIX TEIXEIRA 02', 10, 20, 50, 100, 'Y'),
	(250, 244, 1, 73, 'MIX ITAPIPOCA 01', 'MIX ITAPIPOCA 01', 10, 20, 50, 100, 'Y'),
	(251, 245, 1, 73, 'MIX ITAPIPOCA 02', 'MIX ITAPIPOCA 02', 10, 20, 50, 100, 'Y'),
	(252, 246, 1, 79, 'MIX ARACAJU 1', 'MIX ARACAJU 1', 10, 20, 50, 100, 'Y'),
	(253, 247, 1, 79, 'MIX ARACAJU 2', 'MIX ARACAJU 2', 10, 20, 50, 100, 'Y');
/*!40000 ALTER TABLE `atms` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.atm_types
CREATE TABLE IF NOT EXISTS `atm_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.atm_types: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `atm_types` DISABLE KEYS */;
INSERT INTO `atm_types` (`id`, `name`, `status`) VALUES
	(1, 'Caixa Eletrônico', 'Y'),
	(2, 'Totem', 'Y');
/*!40000 ALTER TABLE `atm_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.authorized_token
CREATE TABLE IF NOT EXISTS `authorized_token` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_user` int(11) NOT NULL DEFAULT 0,
  `token` varchar(255) NOT NULL DEFAULT '0',
  `datetime_access` datetime DEFAULT NULL,
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=54 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.authorized_token: ~12 rows (aproximadamente)
/*!40000 ALTER TABLE `authorized_token` DISABLE KEYS */;
INSERT INTO `authorized_token` (`id`, `id_user`, `token`, `datetime_access`, `active`) VALUES
	(42, 1, '$2y$10$SaAvGaZB2g9v7/BczmthTuMrXjx/VIWz11RvH5OJPdPKwMI0bm51.', '2021-10-02 20:11:41', 'N'),
	(43, 1, '$2y$10$0kwQaUMnr1z/xVH6vGTVZ.0OXHTbFRIwdvEq3z01KMMjbuS.d2N3O', '2021-10-02 20:11:54', 'N'),
	(44, 1, '$2y$10$GyjBqZhaTdPgWh6r94xNo.auqhSWrdKEi0qrAlfFZy9Zf1NzEU8N.', '2021-10-02 23:51:06', 'N'),
	(45, 1, '$2y$10$GHN1nfXsmaQbmYGzkV9Guu5Y9.JiRTHWrRqQJwYe6G5D3a5nSEQTW', '2021-10-03 10:23:50', 'N'),
	(46, 1, '$2y$10$rgZhMDl2GerO8eki4ceS6.O/1r25pnUnvC3mRrXX0KKn.Cq9Z7AsG', '2021-10-03 10:27:30', 'N'),
	(47, 1, '$2y$10$sqyOr53q36erDT0k8SnY5.yz2WVEZxpDEM4SwOAKeqE4NEb2QCj2u', '2021-10-04 09:33:23', 'N'),
	(48, 1, '$2y$10$/oA5ILkWNBuiOwGxtAcxfek2Jxz/8mwZ7mCyizghEpkbJco9YlulG', '2021-10-04 19:45:20', 'N'),
	(49, 1, '$2y$10$XwxCiKwz7dIQBKCJ13ezPOPxKlGqq5Teue1KVXOEdQBf4NtT6Mu3y', '2021-10-06 11:58:50', 'N'),
	(50, 1, '$2y$10$hQgc5YUubOKCMpUzL9I.dudQaLrqqz0RzZAEgYAFTlboyY/e8FXXq', '2021-10-06 15:09:22', 'N'),
	(51, 1, '$2y$10$4HvyMvmMUnZaNQhra1fN7ujU4jPs.R9PifdkrUaPEfrWXRXYwa8QG', '2021-10-06 22:27:28', 'N'),
	(52, 1, '$2y$10$mJjcqqOBp9soyRECSIahhedUNcGfWOMLlliq3opWkQJ9BpBT.pYJS', '2021-10-11 22:43:21', 'N'),
	(53, 1, '$2y$10$4DBDZnOtOiu4L6lBiOH/Demz00Wr5nTfogjwLzLWroq2CVQEsv2u2', '2021-10-12 10:32:19', 'Y');
/*!40000 ALTER TABLE `authorized_token` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.batchs
CREATE TABLE IF NOT EXISTS `batchs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_type` int(11) DEFAULT NULL,
  `batch` varchar(100) DEFAULT NULL,
  `date_batch` date DEFAULT NULL,
  `status` int(11) DEFAULT 1,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.batchs: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `batchs` DISABLE KEYS */;
INSERT INTO `batchs` (`id`, `id_type`, `batch`, `date_batch`, `status`) VALUES
	(1, 1, '1649163903', NULL, 1),
	(2, 1, '02000062880d26cd7cb', '2022-05-20', 1),
	(3, 1, '0210006288ec6cc38c1', '2022-05-21', 1);
/*!40000 ALTER TABLE `batchs` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.batch_statuss
CREATE TABLE IF NOT EXISTS `batch_statuss` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.batch_statuss: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `batch_statuss` DISABLE KEYS */;
INSERT INTO `batch_statuss` (`id`, `name`, `status`) VALUES
	(1, 'open', 'Y'),
	(2, 'close', 'Y'),
	(3, 'paused', 'Y'),
	(4, 'Banco', 'Y');
/*!40000 ALTER TABLE `batch_statuss` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.batch_types
CREATE TABLE IF NOT EXISTS `batch_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(60) NOT NULL DEFAULT '',
  `status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.batch_types: ~4 rows (aproximadamente)
/*!40000 ALTER TABLE `batch_types` DISABLE KEYS */;
INSERT INTO `batch_types` (`id`, `name`, `status`) VALUES
	(1, 'Entrada', 'Y'),
	(2, 'Saida', 'Y'),
	(3, 'Abastecimento', 'Y'),
	(4, 'Criação', 'Y');
/*!40000 ALTER TABLE `batch_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.contestations
CREATE TABLE IF NOT EXISTS `contestations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `card` varchar(16) DEFAULT NULL,
  `num_contest_system` varchar(50) DEFAULT NULL,
  `date` date DEFAULT NULL,
  `type` set('mateus','bradesco') DEFAULT 'mateus',
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  `status` set('open','close') NOT NULL DEFAULT 'open',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=29 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.contestations: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `contestations` DISABLE KEYS */;
INSERT INTO `contestations` (`id`, `name`, `card`, `num_contest_system`, `date`, `type`, `active`, `status`) VALUES
	(17, 'DAYSE MIRANDA', '6312919951285052', '453591', '2022-04-22', 'mateus', 'Y', 'open'),
	(27, 'Doidao Sim', '6312457896587451', '52154', '2011-01-11', 'mateus', 'N', 'open'),
	(28, 'ROBERTO JORGE DO NASCIMENTO VICTOR', '6312912271721496', '475740', '2022-05-06', 'mateus', 'Y', 'open');
/*!40000 ALTER TABLE `contestations` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.images
CREATE TABLE IF NOT EXISTS `images` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `path` varchar(200) DEFAULT NULL,
  `id_contestation` int(11) DEFAULT 0,
  `path_image` varchar(200) DEFAULT NULL,
  `hash` varchar(200) DEFAULT NULL,
  `active` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `hash` (`hash`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.images: ~9 rows (aproximadamente)
/*!40000 ALTER TABLE `images` DISABLE KEYS */;
INSERT INTO `images` (`id`, `path`, `id_contestation`, `path_image`, `hash`, `active`) VALUES
	(54, '02e74f10e0327ad868d138f2b4fdd6f0', 27, 'caixa crednosso part. 1', '25981d834ac845951e2b00d0fa87c44d.avi', 'N'),
	(55, '02e74f10e0327ad868d138f2b4fdd6f0', 27, 'caixa crednosso part.2', '120c326234bf5b3a5df014bc9bbee260.avi', 'N'),
	(56, '02e74f10e0327ad868d138f2b4fdd6f0', 27, 'caixa crednosso part.3', '35a3dd5fc0c5a58a8cebd52ac021fab8.avi', 'N'),
	(58, '02e74f10e0327ad868d138f2b4fdd6f0', 27, 'Novo Documento de Texto', '472731b33e78d174ca5f3ec3bd7b7d4c.txt', 'N'),
	(59, '33e75ff09dd601bbe69f351039152189', 28, NULL, NULL, 'N'),
	(60, '02e74f10e0327ad868d138f2b4fdd6f0', 27, NULL, NULL, 'N'),
	(61, '02e74f10e0327ad868d138f2b4fdd6f0', 27, NULL, NULL, 'N'),
	(62, '02e74f10e0327ad868d138f2b4fdd6f0', 27, NULL, NULL, 'N'),
	(63, '02e74f10e0327ad868d138f2b4fdd6f0', 27, '00001', 'd32678c8c6d7fd8bd6d81951f0cde594.jpg', 'Y');
/*!40000 ALTER TABLE `images` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.operation_types
CREATE TABLE IF NOT EXISTS `operation_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.operation_types: ~5 rows (aproximadamente)
/*!40000 ALTER TABLE `operation_types` DISABLE KEYS */;
INSERT INTO `operation_types` (`id`, `name`, `active`) VALUES
	(1, 'Transferencia entre custodia', 'Y'),
	(2, 'Retirada loja', 'Y'),
	(3, 'Entre tesourarias', 'Y'),
	(4, 'Santander', 'Y'),
	(5, 'Seret BB', 'Y');
/*!40000 ALTER TABLE `operation_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.order_types
CREATE TABLE IF NOT EXISTS `order_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.order_types: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `order_types` DISABLE KEYS */;
INSERT INTO `order_types` (`id`, `name`, `active`) VALUES
	(1, 'eventual', 'Y'),
	(2, 'folha', 'Y');
/*!40000 ALTER TABLE `order_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.requests
CREATE TABLE IF NOT EXISTS `requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_batch` int(11) DEFAULT NULL,
  `id_operation_type` int(11) NOT NULL DEFAULT 0,
  `id_order_type` int(11) NOT NULL,
  `id_status` int(11) DEFAULT 1,
  `id_origin` int(11) NOT NULL,
  `id_destiny` int(11) NOT NULL,
  `date_request` date NOT NULL,
  `qt_10` int(11) DEFAULT NULL,
  `qt_20` int(11) DEFAULT NULL,
  `qt_50` int(11) DEFAULT NULL,
  `qt_100` int(11) DEFAULT NULL,
  `value_total` float DEFAULT 0,
  `confirmed_value` float DEFAULT 0,
  `change_in_confirmation` enum('Y','N') DEFAULT 'N',
  `note` text DEFAULT NULL,
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=69 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.requests: ~8 rows (aproximadamente)
/*!40000 ALTER TABLE `requests` DISABLE KEYS */;
INSERT INTO `requests` (`id`, `id_batch`, `id_operation_type`, `id_order_type`, `id_status`, `id_origin`, `id_destiny`, `date_request`, `qt_10`, `qt_20`, `qt_50`, `qt_100`, `value_total`, `confirmed_value`, `change_in_confirmation`, `note`, `active`) VALUES
	(41, 1, 2, 1, 1, 56, 0, '2022-04-05', 100, 100, 100, 100, 0, 0, 'N', '', 'Y'),
	(42, 1, 2, 1, 1, 76, 0, '2022-04-05', 200, 200, 200, 200, 0, 0, 'N', 'sem OBS', 'Y'),
	(43, 2, 2, 1, 1, 20, 0, '2022-06-03', 100, 100, 100, 100, 18, 0, 'N', '', 'Y'),
	(45, 3, 2, 1, 2, 21, 0, '2022-06-03', 100, 100, 100, 100, 18000, 18000, 'N', 'sem', 'Y'),
	(46, 3, 2, 1, 2, 23, 0, '2022-05-21', 100, 100, 100, 100, 30000, 18000, 'Y', 'mais testes', 'Y'),
	(66, 3, 1, 1, 2, 8, 2, '2022-05-21', 100, 200, 100, 200, 30000, 30000, 'N', '', 'Y'),
	(67, 3, 3, 1, 1, 8, 2, '2022-05-21', 100, 200, 100, 200, 30000, 0, 'N', '', 'Y'),
	(68, 3, 2, 1, 1, 17, 0, '2022-05-21', 100, 200, 100, 200, 30000, 30000, 'N', '', 'Y');
/*!40000 ALTER TABLE `requests` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.request_payrolls
CREATE TABLE IF NOT EXISTS `request_payrolls` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_shipping` int(11) NOT NULL DEFAULT 0,
  `cass_A` int(11) NOT NULL DEFAULT 0,
  `cass_B` int(11) NOT NULL DEFAULT 0,
  `cass_C` int(11) NOT NULL DEFAULT 0,
  `cass_D` int(11) NOT NULL DEFAULT 0,
  `balance` float NOT NULL DEFAULT 0,
  `id_type` int(11) DEFAULT 1,
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=103 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.request_payrolls: ~102 rows (aproximadamente)
/*!40000 ALTER TABLE `request_payrolls` DISABLE KEYS */;
INSERT INTO `request_payrolls` (`id`, `id_shipping`, `cass_A`, `cass_B`, `cass_C`, `cass_D`, `balance`, `id_type`, `status`) VALUES
	(1, 56, 100, 200, 500, 600, 90000, 1, 'Y'),
	(2, 34, 500, 500, 1300, 1500, 230000, 1, 'Y'),
	(3, 42, 500, 500, 1300, 1400, 220000, 1, 'Y'),
	(4, 27, 600, 700, 2200, 2200, 350000, 1, 'Y'),
	(5, 19, 500, 1000, 2500, 2500, 400000, 1, 'Y'),
	(6, 38, 200, 400, 1200, 1300, 200000, 1, 'Y'),
	(7, 53, 200, 400, 800, 900, 140000, 1, 'Y'),
	(8, 57, 200, 400, 1000, 1000, 160000, 1, 'Y'),
	(9, 29, 100, 200, 300, 300, 50000, 1, 'Y'),
	(10, 18, 100, 200, 300, 400, 60000, 1, 'Y'),
	(11, 17, 100, 200, 300, 400, 60000, 1, 'Y'),
	(12, 39, 200, 400, 1200, 1500, 220000, 1, 'Y'),
	(13, 20, 500, 500, 2300, 2500, 380000, 1, 'Y'),
	(14, 21, 200, 400, 1800, 2400, 340000, 1, 'Y'),
	(15, 24, 100, 200, 300, 300, 50000, 1, 'Y'),
	(16, 32, 500, 500, 1900, 2400, 350000, 1, 'Y'),
	(17, 48, 100, 200, 1500, 1600, 240000, 1, 'Y'),
	(18, 44, 200, 400, 1600, 1600, 250000, 1, 'Y'),
	(19, 46, 200, 400, 1000, 1400, 200000, 1, 'Y'),
	(20, 60, 200, 400, 1400, 1200, 200000, 1, 'Y'),
	(21, 43, 500, 500, 2100, 2300, 350000, 1, 'Y'),
	(22, 28, 200, 400, 1000, 1300, 190000, 1, 'Y'),
	(23, 35, 300, 600, 2300, 2500, 380000, 1, 'Y'),
	(24, 52, 500, 500, 1900, 1900, 300000, 1, 'Y'),
	(25, 61, 200, 400, 800, 800, 130000, 1, 'Y'),
	(26, 47, 500, 500, 1900, 1900, 300000, 1, 'Y'),
	(27, 51, 100, 200, 1500, 1800, 260000, 1, 'Y'),
	(28, 58, 200, 400, 1000, 1000, 160000, 1, 'Y'),
	(29, 30, 100, 200, 1300, 1600, 230000, 1, 'Y'),
	(30, 26, 100, 200, 900, 1000, 150000, 1, 'Y'),
	(31, 41, 500, 500, 1700, 1800, 280000, 1, 'Y'),
	(32, 40, 500, 500, 1700, 1800, 280000, 1, 'Y'),
	(33, 23, 200, 400, 1200, 1300, 200000, 1, 'Y'),
	(34, 22, 500, 500, 1100, 1300, 200000, 1, 'Y'),
	(35, 33, 500, 500, 1700, 2000, 300000, 1, 'Y'),
	(36, 37, 100, 200, 700, 900, 130000, 1, 'Y'),
	(37, 55, 100, 200, 700, 600, 100000, 1, 'Y'),
	(38, 45, 200, 400, 2600, 2600, 400000, 1, 'Y'),
	(39, 36, 300, 600, 2300, 2500, 380000, 1, 'Y'),
	(40, 50, 500, 500, 1500, 1600, 250000, 1, 'Y'),
	(41, 31, 200, 400, 1200, 1300, 200000, 1, 'Y'),
	(42, 59, 100, 200, 900, 1000, 150000, 1, 'Y'),
	(43, 76, 100, 200, 900, 900, 140000, 1, 'Y'),
	(44, 68, 500, 500, 1700, 1700, 270000, 1, 'Y'),
	(45, 78, 100, 200, 500, 400, 70000, 1, 'Y'),
	(46, 71, 500, 500, 1500, 1300, 220000, 1, 'Y'),
	(47, 74, 100, 200, 500, 500, 80000, 1, 'Y'),
	(48, 62, 200, 400, 1800, 1800, 280000, 1, 'Y'),
	(49, 65, 500, 500, 1500, 1500, 240000, 1, 'Y'),
	(50, 72, 500, 500, 1500, 1600, 250000, 1, 'Y'),
	(51, 66, 500, 500, 2100, 2100, 330000, 1, 'Y'),
	(52, 69, 200, 400, 600, 800, 120000, 1, 'Y'),
	(53, 70, 200, 400, 600, 800, 120000, 1, 'Y'),
	(54, 64, 200, 400, 1200, 1300, 200000, 1, 'Y'),
	(55, 77, 100, 200, 300, 500, 70000, 1, 'Y'),
	(56, 73, 0, 0, 0, 0, 0, 1, 'Y'),
	(57, 79, 100, 200, 500, 500, 80000, 1, 'Y'),
	(58, 68, 100, 100, 100, 120, 20000, 2, 'Y'),
	(59, 55, 100, 100, 100, 120, 20000, 2, 'Y'),
	(60, 56, 100, 100, 100, 120, 20000, 2, 'Y'),
	(61, 48, 100, 100, 100, 120, 20000, 2, 'Y'),
	(62, 62, 100, 100, 100, 120, 20000, 2, 'Y'),
	(63, 76, 100, 200, 100, 200, 30000, 2, 'Y'),
	(64, 57, 100, 200, 100, 200, 30000, 2, 'Y'),
	(65, 24, 100, 200, 100, 200, 30000, 2, 'Y'),
	(66, 37, 100, 200, 300, 200, 40000, 2, 'Y'),
	(67, 34, 100, 200, 300, 200, 40000, 2, 'Y'),
	(68, 44, 100, 200, 300, 200, 40000, 2, 'Y'),
	(69, 28, 100, 200, 300, 200, 40000, 2, 'Y'),
	(70, 36, 100, 200, 300, 200, 40000, 2, 'Y'),
	(71, 39, 100, 200, 300, 200, 40000, 2, 'Y'),
	(72, 46, 100, 200, 300, 300, 50000, 2, 'Y'),
	(73, 30, 100, 200, 300, 400, 60000, 2, 'Y'),
	(74, 61, 100, 200, 300, 300, 50000, 2, 'Y'),
	(75, 43, 100, 200, 300, 300, 50000, 2, 'Y'),
	(76, 41, 100, 200, 300, 300, 50000, 2, 'Y'),
	(77, 60, 100, 200, 300, 300, 50000, 2, 'Y'),
	(78, 31, 100, 200, 300, 300, 50000, 2, 'Y'),
	(79, 35, 100, 200, 300, 400, 60000, 2, 'Y'),
	(80, 38, 100, 200, 300, 300, 50000, 2, 'Y'),
	(81, 33, 100, 200, 300, 400, 60000, 2, 'Y'),
	(82, 45, 100, 200, 300, 400, 60000, 2, 'Y'),
	(83, 53, 100, 200, 300, 400, 60000, 2, 'Y'),
	(84, 21, 100, 200, 300, 400, 60000, 2, 'Y'),
	(85, 26, 100, 200, 300, 400, 60000, 2, 'Y'),
	(86, 23, 100, 200, 300, 500, 70000, 2, 'Y'),
	(87, 22, 100, 200, 300, 500, 70000, 2, 'Y'),
	(88, 59, 100, 200, 300, 500, 70000, 2, 'Y'),
	(89, 20, 100, 200, 500, 500, 80000, 2, 'Y'),
	(90, 32, 100, 200, 500, 500, 80000, 2, 'Y'),
	(91, 51, 100, 200, 500, 500, 80000, 2, 'Y'),
	(92, 50, 100, 200, 500, 500, 80000, 2, 'Y'),
	(93, 42, 100, 200, 500, 400, 70000, 2, 'Y'),
	(94, 27, 100, 200, 700, 800, 120000, 2, 'Y'),
	(95, 58, 100, 200, 500, 500, 80000, 2, 'Y'),
	(96, 19, 100, 200, 500, 700, 100000, 2, 'Y'),
	(97, 52, 100, 200, 500, 700, 100000, 2, 'Y'),
	(98, 65, 200, 400, 600, 800, 120000, 2, 'Y'),
	(99, 40, 200, 400, 400, 700, 100000, 2, 'Y'),
	(100, 72, 100, 200, 500, 500, 80000, 2, 'Y'),
	(101, 66, 100, 200, 700, 800, 120000, 2, 'Y'),
	(102, 47, 100, 200, 500, 900, 120000, 2, 'Y');
/*!40000 ALTER TABLE `request_payrolls` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.request_payroll_types
CREATE TABLE IF NOT EXISTS `request_payroll_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.request_payroll_types: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `request_payroll_types` DISABLE KEYS */;
INSERT INTO `request_payroll_types` (`id`, `name`, `status`) VALUES
	(1, 'Salário', 'Y'),
	(2, 'Férias', 'Y');
/*!40000 ALTER TABLE `request_payroll_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.request_pdfs
CREATE TABLE IF NOT EXISTS `request_pdfs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name_company` varchar(100) NOT NULL DEFAULT '0',
  `name` varchar(150) DEFAULT NULL,
  `integrity` varchar(250) NOT NULL DEFAULT '',
  `date` date NOT NULL,
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.request_pdfs: ~6 rows (aproximadamente)
/*!40000 ALTER TABLE `request_pdfs` DISABLE KEYS */;
INSERT INTO `request_pdfs` (`id`, `name_company`, `name`, `integrity`, `date`, `status`) VALUES
	(6, 'mateus', 'pedido-21-05-2022-mateus.pdf', '75473390362bda407c1ed24.70083548', '2022-05-21', 'Y'),
	(7, 'posterus', 'pedido-21-05-2022-posterus.pdf', '75473390362bda407c1ed24.70083548', '2022-05-21', 'Y'),
	(8, 'entre-tesourarias', 'entre-tesourarias-21-05-2022.pdf', '75473390362bda407c1ed24.70083548', '2022-05-21', 'Y'),
	(9, 'mateus', 'pedido-05-04-2022-mateus.pdf', '74295288862b4c0f11b6df0.16454448', '2022-04-05', 'Y'),
	(10, 'mateus_pg', 'pedido-21-05-2022-mateus-a.pdf', '91548056362bdb70a99d543.10764877', '2022-05-21', 'Y'),
	(11, 'posterus_pg', 'pedido-21-05-2022-posterus-a.pdf', '91548056362bdb70a99d543.10764877', '2022-05-21', 'Y');
/*!40000 ALTER TABLE `request_pdfs` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.request_statuss
CREATE TABLE IF NOT EXISTS `request_statuss` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.request_statuss: ~5 rows (aproximadamente)
/*!40000 ALTER TABLE `request_statuss` DISABLE KEYS */;
INSERT INTO `request_statuss` (`id`, `name`, `status`) VALUES
	(1, 'aberto', 'Y'),
	(2, 'confirmado', 'Y'),
	(3, 'pago', 'Y'),
	(4, 'relançado', 'Y'),
	(5, 'cancelado', 'Y');
/*!40000 ALTER TABLE `request_statuss` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.shippings
CREATE TABLE IF NOT EXISTS `shippings` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_type` int(11) DEFAULT 2,
  `id_region` int(11) DEFAULT 0,
  `id_gmcore` int(11) DEFAULT 0,
  `id_shipping` int(11) DEFAULT NULL,
  `account` varchar(50) DEFAULT NULL,
  `name_shipping` varchar(100) DEFAULT NULL,
  `emails` text DEFAULT NULL,
  `active` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_shipping` (`id_shipping`)
) ENGINE=InnoDB AUTO_INCREMENT=88 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.shippings: ~85 rows (aproximadamente)
/*!40000 ALTER TABLE `shippings` DISABLE KEYS */;
INSERT INTO `shippings` (`id`, `id_type`, `id_region`, `id_gmcore`, `id_shipping`, `account`, `name_shipping`, `emails`, `active`) VALUES
	(1, 2, 0, 0, 1, '1045', 'MATEUS SUPERMERCADOS', 'taricisio.silva@crednosso.com.br', 'Y'),
	(2, 1, 5, 0, 2, '1288', 'PROSEGUR SAO LUIS', '', 'Y'),
	(3, 1, 6, 0, 3, '2704', 'PROSEGUR MARABA', '', 'N'),
	(4, 1, 21, 0, 4, '5925', 'PROSEGUR BACABAL', '', 'N'),
	(5, 1, 0, 0, 5, '101580', 'PROFORT', '', 'N'),
	(6, 1, 0, 0, 6, '114229', 'PROSEGUR IMPERATRIZ', '', 'N'),
	(7, 1, 10, 0, 7, '137809', 'CEFOR BALSAS', '', 'Y'),
	(8, 1, 19, 0, 8, '140381', 'CEFOR SAO LUIS', '', 'Y'),
	(9, 1, 11, 0, 9, '144827', 'CEFOR IMPERATRIZ', '', 'Y'),
	(10, 1, 0, 0, 10, '152805', 'PROSEGUR PARAUAPEBAS', '', 'N'),
	(11, 1, 9, 0, 11, '161699', 'CEFOR BACABAL', '', 'Y'),
	(12, 1, 16, 0, 12, '216881', 'PROSEGUR TERESINA', '', 'Y'),
	(13, 1, 0, 0, 13, '225056', 'PROSEGUR BELEM', '', 'N'),
	(14, 1, 25, 0, 14, '225103', 'PROSEGUR CASTANHAL', '', 'Y'),
	(15, 1, 17, 0, 15, '230322', 'PROSEGUR FORTALEZA', '', 'Y'),
	(16, 1, 0, 0, 16, '233215', 'PROSEGUR ALTAMIRA', '', 'N'),
	(17, 2, 27, 423, 17, '278350', 'BRD CAMINO TUCUMA', '', 'Y'),
	(18, 2, 28, 416, 18, '278913', 'BRD CAMINO JACUNDA', '', 'Y'),
	(19, 2, 21, 47, 19, '372738', 'BRD BACABAL', '', 'Y'),
	(20, 2, 38, 41, 20, '374376', 'BRD MIX CAXIAS', '', 'Y'),
	(21, 2, 30, 39, 21, '374556', 'BRD CHAPADINHA', '', 'Y'),
	(22, 2, 14, 48, 22, '374563', 'BRD PEDREIRAS', '', 'Y'),
	(23, 2, 43, 251, 23, '390954', 'BRD PARNAIBA', '', 'Y'),
	(24, 2, 12, 437, 24, '392443', 'BRD CONCEICAO DO ARAGUAIA', '', 'Y'),
	(25, 2, 0, 0, 25, '393511', 'PROSEGUR PARNAIBA', NULL, 'N'),
	(26, 2, 42, 201, 26, '410120', 'BRD NOVO SUPER COHATRAC', '', 'Y'),
	(27, 2, 44, 44, 27, '410817', 'BRD BABAÇULANDIA', '', 'Y'),
	(28, 2, 39, 202, 28, '418178', 'BRD MATEUS CODO', '', 'Y'),
	(29, 2, 37, 438, 29, '436348', 'BRD CAMINO GRAJAU', '', 'Y'),
	(30, 2, 59, 25, 30, '451859', 'BRD NOVA MARABA', '', 'Y'),
	(31, 2, 15, 203, 31, '455494', 'BRD TAILANDIA', '', 'Y'),
	(32, 2, 29, 257, 32, '455496', 'BRD COQUEIRO', '', 'Y'),
	(33, 2, 31, 99, 33, '462533', 'BRD PINHEIRO', '', 'Y'),
	(34, 2, 35, 50, 34, '463904', 'BRD ABAETETUBA', '', 'Y'),
	(35, 2, 54, 49, 35, '464217', 'BRD MIX CASTANHAL', '', 'Y'),
	(36, 2, 55, 35, 36, '470014', 'BRD SUPER CASTANHAL', '', 'Y'),
	(37, 2, 13, 42, 37, '471541', 'BRD PRESIDENTE DUTRA', '', 'Y'),
	(38, 2, 34, 204, 38, '474497', 'BRD BARCARENA', '', 'Y'),
	(39, 2, 36, 256, 39, '485690', 'BRD CAPANEMA', '', 'Y'),
	(40, 2, 18, 28, 40, '485991', 'BRD PARAUAPEBAS 28', '', 'Y'),
	(41, 2, 57, 254, 41, '485993', 'BRD PARAUAPEBAS 254', '', 'Y'),
	(42, 2, 24, 38, 42, '486332', 'BRD ALTAMIRA', '', 'Y'),
	(43, 2, 8, 51, 43, '489172', 'BRD MARITUBA', '', 'Y'),
	(44, 2, 40, 46, 44, '490154', 'BRD MAGUARI', '', 'Y'),
	(45, 2, 46, 37, 45, '491573', 'BRD SUPER BELEM', '', 'Y'),
	(46, 2, 4, 45, 46, '491575', 'BRD MARAMBAIA', '', 'Y'),
	(47, 2, 20, 253, 47, '491577', 'BRD INFRAERO', '', 'Y'),
	(48, 2, 41, 36, 48, '491579', 'BRD JARDELANDIA', '', 'Y'),
	(49, 2, 0, 0, 49, '491813', 'BRD SUPER BELEM', NULL, 'N'),
	(50, 2, 6, 24, 50, '492235', 'BRD SUPER MARABA', '', 'Y'),
	(51, 2, 60, 26, 51, '492237', 'BRD MIX MARABA', '', 'Y'),
	(52, 2, 53, 97, 52, '495866', 'BRD MIX CEASA', '', 'Y'),
	(53, 2, 26, 40, 53, '502875', 'BRD BARRA DO CORDA', '', 'Y'),
	(54, 2, 0, 0, 54, '506235', 'COHAMA - RECICLADORA', NULL, 'N'),
	(55, 2, 48, 261, 55, '506752', 'BRD REDENÇÃO', '', 'Y'),
	(56, 2, 50, 434, 56, '509705', 'BRD BARREIRINHAS CAMINO', '', 'Y'),
	(57, 2, 47, 207, 57, '530639', 'BRD BURITICUPU', '', 'Y'),
	(58, 2, 33, 260, 58, '541925', 'BRD MIX TUCURUI', '', 'Y'),
	(59, 2, 45, 264, 59, '545315', 'BRD TIANGUA', '', 'Y'),
	(60, 2, 51, 263, 60, '563193	', 'BRD MARIO COVAS', '', 'Y'),
	(61, 2, 52, 271, 61, '563197', 'BRD MIX FLORIANO', '', 'Y'),
	(62, 2, 61, 266, 62, '595175', 'BRD MIX SOBRAL', '', 'Y'),
	(63, 2, 0, 0, 63, '603181', 'TESTE', NULL, 'N'),
	(64, 2, 62, 211, 64, '603388', 'SUPER PIRIPIRI', '', 'Y'),
	(65, 2, 64, 0, 65, '604927', 'MIX TERESINA', '', 'Y'),
	(66, 2, 63, 32, 66, '604927', 'MIX TIMON', '', 'Y'),
	(68, 1, 67, 67, 67, '627550', 'PRESERV - RECIFE', '', 'Y'),
	(69, 2, 56, 267, 68, '633647', 'MIX BRAGANCA', '', 'Y'),
	(71, 2, 69, 208, 69, '633649', 'SUPER CANAA DOS CARAJAS', '', 'Y'),
	(72, 2, 65, 213, 70, '633651', 'SUPER ESTREITO', '', 'Y'),
	(73, 2, 58, 268, 71, '633653', 'MIX PARAGOMINAS', '', 'Y'),
	(74, 2, 72, 275, 72, '657105', 'MIX TIMON ALVORADA', '', 'Y'),
	(75, 2, 71, 278, 73, '665188', 'MIX JUAZEIRO', '', 'Y'),
	(76, 2, 70, 279, 74, '665575', 'MIX PETROLINA', '', 'Y'),
	(77, 1, 66, 0, 75, '666346', 'PROSEGUR FEIRA DE SANTANA', '', 'Y'),
	(78, 2, 80, 275, 76, '671437', 'MIX BENGUI', '', 'Y'),
	(79, 2, 74, 282, 77, '685900', 'TEXEIRA DE FREITAS', '', 'Y'),
	(80, 2, 73, 280, 78, '685909', 'MIX ITAPIPOCA', '', 'Y'),
	(81, 3, 0, 0, 444, NULL, 'SANTANDER', 'TARCISIO.SILVA@CREDNOSSO.COM.BR', 'Y'),
	(82, 3, 0, 0, 555, NULL, 'SERET BB', 'DILLAN.SOUSA@CREDNOSSO.COM.BR', 'Y'),
	(83, 2, 79, 281, 79, '704377', 'MIX ARACAJU', 'JULIANA.MESSIAS@GRUPOMATEUS.COM.BR', 'Y'),
	(84, 2, 78, 285, 80, NULL, 'SUPER CRATEUS', 'LUZIMEIRE.ALVES@GRUPOMATEUS.COM.BR', 'Y'),
	(85, 2, 5, 7, 81, NULL, 'SUPER COHAMA', 'sm7.fechamento@grupomateus.com.br', 'Y'),
	(86, 2, 5, 20, 82, NULL, 'CURVA DO 90', 'sm20.tesouraria@grupomateus.com.br', 'Y'),
	(87, 2, 5, 17, 83, NULL, 'MIX GUAJAJARAS', 'Sm17.tesouraria@grupomateus.com.br;Harlidejane.anjos@grupomateus.com.br', 'Y');
/*!40000 ALTER TABLE `shippings` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.shipping_gmcores
CREATE TABLE IF NOT EXISTS `shipping_gmcores` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_gmcore` int(11) NOT NULL DEFAULT 0,
  `id_company` int(11) DEFAULT 0,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `id_gmcore` (`id_gmcore`)
) ENGINE=InnoDB AUTO_INCREMENT=64 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.shipping_gmcores: ~63 rows (aproximadamente)
/*!40000 ALTER TABLE `shipping_gmcores` DISABLE KEYS */;
INSERT INTO `shipping_gmcores` (`id`, `id_gmcore`, `id_company`, `name`, `status`) VALUES
	(1, 423, 15, 'CAMINO TUCUMA', 'Y'),
	(2, 416, 15, 'CAMINO JACUNDA', 'Y'),
	(3, 47, 2, 'MIX BACABAL', 'Y'),
	(4, 41, 2, 'MIX CAXIAS', 'Y'),
	(5, 39, 2, 'MIX CHAPADINHA', 'Y'),
	(6, 48, 2, 'MIX PEDREIRAS', 'Y'),
	(7, 251, 2, 'MIX PARNAIBA', 'Y'),
	(8, 437, 15, 'CAMINO CONCEICAO DO ARAGUAIA', 'Y'),
	(9, 201, 2, 'SUPER COHATRAC NOVO', 'Y'),
	(10, 44, 2, 'MIX BABACULANDIA', 'Y'),
	(11, 202, 2, 'SUPER CODO', 'Y'),
	(12, 438, 15, 'CAMINO GRAJAU', 'Y'),
	(13, 25, 2, 'MIX NOVA MARABA', 'Y'),
	(14, 203, 2, 'SUPER TAILANDIA', 'Y'),
	(15, 257, 2, 'MIX INDEPENDENCIA', 'Y'),
	(16, 99, 2, 'MIX PINHEIRO', 'Y'),
	(17, 50, 2, 'MIX ABAETETUBA', 'Y'),
	(18, 49, 2, 'MIX CASTANHAL', 'Y'),
	(19, 35, 2, 'SUPER CASTANHAL', 'Y'),
	(20, 42, 2, 'SUPER PRESIDENTE DUTRA', 'Y'),
	(21, 204, 2, 'SUPER BARCARENA', 'Y'),
	(22, 256, 2, 'MIX CAPANEMA', 'Y'),
	(23, 28, 2, 'SUPER PARAUAPEBAS - 28', 'Y'),
	(24, 254, 2, 'MIX PARAUAPEBAS - 254', 'Y'),
	(25, 38, 2, 'MIX ALTAMIRA', 'Y'),
	(26, 51, 2, 'MIX MARITUBA', 'Y'),
	(27, 46, 2, 'SUPER MAGUARI', 'Y'),
	(28, 37, 2, 'SUPER BELEM', 'Y'),
	(29, 45, 2, 'SUPER MARAMBAIA', 'Y'),
	(30, 253, 2, 'MIX INFRAERO', 'Y'),
	(31, 36, 2, 'SUPER JARDELANDIA', 'Y'),
	(32, 24, 2, 'SUPER MARABA', 'Y'),
	(33, 26, 2, 'MIX MARABA', 'Y'),
	(34, 97, 2, 'MIX TERESINA CEASA', 'Y'),
	(35, 40, 2, 'SUPER BARRA DO CORDA', 'Y'),
	(36, 261, 2, 'MIX REDENÇÃO', 'Y'),
	(37, 434, 2, 'CAMINO BARREIRINHAS', 'Y'),
	(38, 207, 2, 'SUPER BURITICUPU', 'Y'),
	(39, 260, 2, 'MIX TUCURUI', 'Y'),
	(40, 264, 2, 'MIX TIANGUA', 'Y'),
	(41, 263, 2, 'MIX MARIO COVAS', 'Y'),
	(42, 271, 2, 'MIX FLORIANO', 'Y'),
	(43, 266, 2, 'MIX SOBRAL', 'Y'),
	(44, 211, 2, 'SUPER PIRIPIRI', 'Y'),
	(45, 252, 2, 'MIX TERESINA-NOVA FAPI', 'Y'),
	(46, 32, 2, 'MIX TIMON', 'Y'),
	(47, 268, 2, 'MIX PARAGOMINAS', 'Y'),
	(48, 67, 2, 'TRANSP', 'Y'),
	(49, 213, 2, 'SUPER ESTREITO', 'Y'),
	(50, 267, 2, 'MIX BRAGANCA', 'Y'),
	(51, 208, 2, 'SUPER CANAA DOS CARAJAS', 'Y'),
	(52, 275, 2, 'MIX TIMON ALVORADA', 'Y'),
	(53, 278, 2, 'MIX JUAZEIRO', 'Y'),
	(54, 279, 2, 'MIX PETROLINA', 'Y'),
	(55, 276, 2, 'MIX BENGUI', 'Y'),
	(56, 282, 2, 'TEXEIRA DE FREITAS', 'Y'),
	(57, 280, 2, 'MIX ITAPIPOCA', 'Y'),
	(58, 0, 0, 'NAO APLICAVEL', 'Y'),
	(59, 285, 2, 'SUPER CRATEUS', 'Y'),
	(60, 7, 2, 'SUPER COHAMA', 'Y'),
	(61, 20, 2, 'CURVA DO 90', 'Y'),
	(62, 17, 2, 'MIX GUAJAJARAS', 'Y'),
	(63, 281, 2, 'MIX ARACAJU', 'Y');
/*!40000 ALTER TABLE `shipping_gmcores` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.shipping_gmcore_companys
CREATE TABLE IF NOT EXISTS `shipping_gmcore_companys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_company` int(11) DEFAULT 0,
  `name` varchar(100) DEFAULT NULL,
  `status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_company` (`id_company`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.shipping_gmcore_companys: ~2 rows (aproximadamente)
/*!40000 ALTER TABLE `shipping_gmcore_companys` DISABLE KEYS */;
INSERT INTO `shipping_gmcore_companys` (`id`, `id_company`, `name`, `status`) VALUES
	(1, 2, 'MATEUS', 'Y'),
	(2, 15, 'CAMINO', 'Y');
/*!40000 ALTER TABLE `shipping_gmcore_companys` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.shipping_regions
CREATE TABLE IF NOT EXISTS `shipping_regions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_region` int(11) DEFAULT NULL,
  `name` varchar(100) DEFAULT NULL,
  `status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=77 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.shipping_regions: ~76 rows (aproximadamente)
/*!40000 ALTER TABLE `shipping_regions` DISABLE KEYS */;
INSERT INTO `shipping_regions` (`id`, `id_region`, `name`, `status`) VALUES
	(1, 4, 'MARAMBAIA', 'Y'),
	(2, 5, 'SAO LUIS', 'Y'),
	(3, 6, 'MARABA', 'Y'),
	(4, 7, 'ACAILANDIA', 'Y'),
	(5, 8, 'MARITUBA', 'Y'),
	(6, 9, 'SANTA INES', 'Y'),
	(7, 10, 'BALSAS', 'Y'),
	(8, 11, 'IMPERATRIZ - CEFOR', 'Y'),
	(9, 12, 'C ARAGUAIA BRD', 'Y'),
	(10, 13, 'PR DUTRA BRD', 'Y'),
	(11, 14, 'PEDREIRAS BRD', 'Y'),
	(12, 15, 'TAILANDIA', 'Y'),
	(13, 16, 'TERESINA', 'Y'),
	(14, 17, 'FORTALEZA', 'Y'),
	(15, 18, 'PARAUAPEBAS28', 'Y'),
	(16, 19, 'SAO LUIS - CEFOR', 'Y'),
	(17, 20, 'INFRAERO MIX', 'Y'),
	(18, 21, 'BACABAL', 'Y'),
	(19, 22, 'ADMINISTRATIVO', 'Y'),
	(20, 23, 'BELEM', 'Y'),
	(21, 24, 'ALTAMIRA', 'Y'),
	(22, 25, 'SANTA IZABEL - CD PROSEGUR', 'Y'),
	(23, 26, 'BARRA CORDA BRD', 'Y'),
	(24, 27, 'TUCUMA BRD', 'Y'),
	(25, 28, 'JACUNDA BRD', 'Y'),
	(26, 29, 'COQUEIRO BRD', 'Y'),
	(27, 30, 'CHAPADINHA BRD', 'Y'),
	(28, 31, 'PINHEIRO', 'Y'),
	(29, 33, 'TUCURUI', 'Y'),
	(30, 34, 'BARCARENA BRD', 'Y'),
	(31, 35, 'ABAETETUBA', 'Y'),
	(32, 36, 'CAPANEMA BRD', 'Y'),
	(33, 37, 'GRAJAU BRD', 'Y'),
	(34, 38, 'CAXIAS BRD', 'Y'),
	(35, 39, 'CODO BRD', 'Y'),
	(36, 40, 'MAGUARI', 'Y'),
	(37, 41, 'JARDELANDIA', 'Y'),
	(38, 42, 'COHATRAC BRD', 'Y'),
	(39, 43, 'PARNAIBA BRD', 'Y'),
	(40, 44, 'BABACULANDIA BRD', 'Y'),
	(41, 45, 'TIANGUA', 'Y'),
	(42, 46, 'BELEM MIX', 'Y'),
	(43, 47, 'BURITICUPU', 'Y'),
	(44, 48, 'REDENCAO BRD', 'Y'),
	(45, 49, 'COHAMA - RECICLADORA', 'Y'),
	(46, 50, 'BARREIRINHAS', 'Y'),
	(47, 51, 'MARIO COVAS', 'Y'),
	(48, 52, 'FLORIANO', 'Y'),
	(49, 53, 'CEASA MIX', 'Y'),
	(50, 54, 'CASTANHAL MIX', 'Y'),
	(51, 55, 'CASTANHAL SUPER', 'Y'),
	(52, 56, 'BRAGANCA', 'Y'),
	(53, 57, 'PARAUAPEBAS254', 'Y'),
	(54, 58, 'PARAGOMINAS', 'Y'),
	(55, 59, 'NOVA MARABA BRD', 'Y'),
	(56, 60, 'MARABA MIX', 'Y'),
	(57, 61, 'SOBRAL MIX', 'Y'),
	(58, 62, 'PIRIPIRI SUPER', 'Y'),
	(59, 63, 'TIMON MIX', 'Y'),
	(60, 64, 'TERESINA MIX', 'Y'),
	(61, 65, 'SUPER ESTREITO', 'Y'),
	(62, 66, 'FEIRA DE SANTANA', 'Y'),
	(63, 67, 'PRESERV RECIFE', 'Y'),
	(64, 69, 'SUPER CANAA DOS CARAJAS', 'Y'),
	(65, 70, 'PETROLINA', 'Y'),
	(66, 71, 'JUAZEIRO', 'Y'),
	(67, 72, 'MIX TIMON ALVORADA', 'Y'),
	(68, 73, 'ITAPIPOCA', 'Y'),
	(69, 74, 'TEIXEIRA DE FREITAS', 'Y'),
	(70, 75, 'SALVADOR ADM', 'Y'),
	(71, 76, 'RECIFE ADM', 'Y'),
	(72, 77, 'MACEIO', 'Y'),
	(73, 78, 'CRATEUS', 'Y'),
	(74, 79, 'ARACAJU', 'Y'),
	(75, 80, 'BENGUI MIX', 'Y'),
	(76, 0, 'NAO APLICAVEL', 'Y');
/*!40000 ALTER TABLE `shipping_regions` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.shipping_types
CREATE TABLE IF NOT EXISTS `shipping_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `status` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.shipping_types: ~3 rows (aproximadamente)
/*!40000 ALTER TABLE `shipping_types` DISABLE KEYS */;
INSERT INTO `shipping_types` (`id`, `name`, `status`) VALUES
	(1, 'Transportadora', 'Y'),
	(2, 'Loja', 'Y'),
	(3, 'Banco', 'Y');
/*!40000 ALTER TABLE `shipping_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.supplies
CREATE TABLE IF NOT EXISTS `supplies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_shipping` int(11) NOT NULL DEFAULT 0,
  `id_atm` int(11) DEFAULT NULL,
  `integrity` varchar(250) DEFAULT NULL,
  `date_supplie` date DEFAULT NULL,
  `a_10` int(11) NOT NULL DEFAULT 0,
  `b_20` int(11) NOT NULL DEFAULT 0,
  `c_50` int(11) NOT NULL DEFAULT 0,
  `d_100` int(11) NOT NULL DEFAULT 0,
  `value_supplie` float NOT NULL DEFAULT 0,
  `id_status` int(11) NOT NULL DEFAULT 1,
  `active` enum('Y','N') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.supplies: ~11 rows (aproximadamente)
/*!40000 ALTER TABLE `supplies` DISABLE KEYS */;
INSERT INTO `supplies` (`id`, `id_shipping`, `id_atm`, `integrity`, `date_supplie`, `a_10`, `b_20`, `c_50`, `d_100`, `value_supplie`, `id_status`, `active`) VALUES
	(2, 2, 2, '002002628d2a9753e4b', '2022-05-24', 100, 200, 100, 200, 30000, 1, 'Y'),
	(5, 1, 70, '001070628d42d3a0b6b', '2022-05-24', 100, 100, 100, 100, 18000, 1, 'Y'),
	(6, 1, 70, '001070628d43ad297c4', '2022-05-24', 100, 100, 100, 100, 18000, 1, 'Y'),
	(38, 21, 126, '021126628f7f0a3b286', '2022-05-26', 100, 100, 100, 100, 18000, 1, 'N'),
	(39, 21, 127, '021126628f7f0a3b286', '2022-05-26', 100, 100, 100, 100, 18000, 1, 'N'),
	(40, 21, 126, '021126628f906beb984', '2022-05-26', 100, 100, 100, 100, 18000, 1, 'N'),
	(41, 21, 127, '021126628f906beb984', '2022-05-26', 100, 100, 100, 100, 18000, 1, 'N'),
	(46, 21, 126, '02112662bdf5b89b1f4', '2022-06-30', 100, 100, 100, 100, 18000, 3, 'Y'),
	(47, 21, 127, '02112762bdfdb43a800', '2022-06-30', 100, 100, 100, 100, 18000, 1, 'Y'),
	(48, 23, 173, '02317362be086c09b24', '2022-06-30', 50, 50, 50, 50, 9000, 1, 'Y'),
	(49, 23, 174, '02317362be086c09b24', '2022-06-30', 50, 50, 50, 50, 9000, 1, 'Y');
/*!40000 ALTER TABLE `supplies` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.supplie_statuss
CREATE TABLE IF NOT EXISTS `supplie_statuss` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) NOT NULL DEFAULT '0',
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.supplie_statuss: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `supplie_statuss` DISABLE KEYS */;
INSERT INTO `supplie_statuss` (`id`, `name`, `active`) VALUES
	(1, 'Aberto', 'Y'),
	(2, 'Finalizado', 'Y'),
	(3, 'Cancelado', 'Y');
/*!40000 ALTER TABLE `supplie_statuss` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.treasurys
CREATE TABLE IF NOT EXISTS `treasurys` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_shipping` int(11) NOT NULL,
  `a_10` int(11) DEFAULT 0,
  `b_20` int(11) DEFAULT 0,
  `c_50` int(11) DEFAULT 0,
  `d_100` int(11) DEFAULT 0,
  `balance` float NOT NULL DEFAULT 0,
  `status` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `id_shipping` (`id_shipping`)
) ENGINE=InnoDB AUTO_INCREMENT=97 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.treasurys: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `treasurys` DISABLE KEYS */;
INSERT INTO `treasurys` (`id`, `id_shipping`, `a_10`, `b_20`, `c_50`, `d_100`, `balance`, `status`) VALUES
	(1, 1, 0, 0, 0, 0, 0, 'Y'),
	(2, 2, 0, 0, 0, 0, 0, 'Y'),
	(4, 21, 100, 100, 100, 100, 18000, 'Y'),
	(5, 23, 0, 0, 0, 0, 0, 'Y'),
	(12, 8, 0, 0, 0, 0, 0, 'Y'),
	(13, 17, 0, 0, 0, 0, 0, 'Y'),
	(18, 3, 0, 0, 0, 0, 0, 'N'),
	(19, 4, 0, 0, 0, 0, 0, 'N'),
	(20, 5, 0, 0, 0, 0, 0, 'N'),
	(21, 6, 0, 0, 0, 0, 0, 'N'),
	(22, 7, 0, 0, 0, 0, 0, 'Y'),
	(23, 9, 0, 0, 0, 0, 0, 'Y'),
	(24, 10, 0, 0, 0, 0, 0, 'N'),
	(25, 11, 0, 0, 0, 0, 0, 'Y'),
	(26, 12, 0, 0, 0, 0, 0, 'Y'),
	(27, 13, 0, 0, 0, 0, 0, 'N'),
	(28, 14, 0, 0, 0, 0, 0, 'Y'),
	(29, 15, 0, 0, 0, 0, 0, 'Y'),
	(30, 16, 0, 0, 0, 0, 0, 'N'),
	(31, 18, 0, 0, 0, 0, 0, 'Y'),
	(32, 19, 0, 0, 0, 0, 0, 'Y'),
	(33, 20, 0, 0, 0, 0, 0, 'Y'),
	(34, 22, 0, 0, 0, 0, 0, 'Y'),
	(35, 24, 0, 0, 0, 0, 0, 'Y'),
	(36, 25, 0, 0, 0, 0, 0, 'N'),
	(37, 26, 0, 0, 0, 0, 0, 'Y'),
	(38, 27, 0, 0, 0, 0, 0, 'Y'),
	(39, 28, 0, 0, 0, 0, 0, 'Y'),
	(40, 29, 0, 0, 0, 0, 0, 'Y'),
	(41, 30, 0, 0, 0, 0, 0, 'Y'),
	(42, 31, 0, 0, 0, 0, 0, 'Y'),
	(43, 32, 0, 0, 0, 0, 0, 'Y'),
	(44, 33, 0, 0, 0, 0, 0, 'Y'),
	(45, 34, 0, 0, 0, 0, 0, 'Y'),
	(46, 35, 0, 0, 0, 0, 0, 'Y'),
	(47, 36, 0, 0, 0, 0, 0, 'Y'),
	(48, 37, 0, 0, 0, 0, 0, 'Y'),
	(49, 38, 0, 0, 0, 0, 0, 'Y'),
	(50, 39, 0, 0, 0, 0, 0, 'Y'),
	(51, 40, 0, 0, 0, 0, 0, 'Y'),
	(52, 41, 0, 0, 0, 0, 0, 'Y'),
	(53, 42, 0, 0, 0, 0, 0, 'Y'),
	(54, 43, 0, 0, 0, 0, 0, 'Y'),
	(55, 44, 0, 0, 0, 0, 0, 'Y'),
	(56, 45, 0, 0, 0, 0, 0, 'Y'),
	(57, 46, 0, 0, 0, 0, 0, 'Y'),
	(58, 47, 0, 0, 0, 0, 0, 'Y'),
	(59, 48, 0, 0, 0, 0, 0, 'Y'),
	(60, 49, 0, 0, 0, 0, 0, 'Y'),
	(61, 50, 0, 0, 0, 0, 0, 'Y'),
	(62, 51, 0, 0, 0, 0, 0, 'Y'),
	(63, 52, 0, 0, 0, 0, 0, 'Y'),
	(64, 53, 0, 0, 0, 0, 0, 'Y'),
	(65, 54, 0, 0, 0, 0, 0, 'N'),
	(66, 55, 0, 0, 0, 0, 0, 'Y'),
	(67, 56, 0, 0, 0, 0, 0, 'Y'),
	(68, 57, 0, 0, 0, 0, 0, 'Y'),
	(69, 58, 0, 0, 0, 0, 0, 'Y'),
	(70, 59, 0, 0, 0, 0, 0, 'Y'),
	(71, 60, 0, 0, 0, 0, 0, 'Y'),
	(72, 61, 0, 0, 0, 0, 0, 'Y'),
	(73, 62, 0, 0, 0, 0, 0, 'Y'),
	(74, 63, 0, 0, 0, 0, 0, 'Y'),
	(75, 64, 0, 0, 0, 0, 0, 'Y'),
	(76, 65, 0, 0, 0, 0, 0, 'Y'),
	(77, 66, 0, 0, 0, 0, 0, 'Y'),
	(78, 67, 0, 0, 0, 0, 0, 'Y'),
	(79, 68, 0, 0, 0, 0, 0, 'Y'),
	(80, 69, 0, 0, 0, 0, 0, 'Y'),
	(81, 70, 0, 0, 0, 0, 0, 'Y'),
	(82, 71, 0, 0, 0, 0, 0, 'Y'),
	(83, 72, 0, 0, 0, 0, 0, 'Y'),
	(84, 73, 0, 0, 0, 0, 0, 'Y'),
	(85, 74, 0, 0, 0, 0, 0, 'Y'),
	(86, 75, 0, 0, 0, 0, 0, 'Y'),
	(87, 76, 0, 0, 0, 0, 0, 'Y'),
	(88, 77, 0, 0, 0, 0, 0, 'Y'),
	(89, 78, 0, 0, 0, 0, 0, 'Y'),
	(90, 444, 0, 0, 0, 0, 0, 'Y'),
	(91, 555, 0, 0, 0, 0, 0, 'Y'),
	(92, 79, 0, 0, 0, 0, 0, 'Y'),
	(93, 80, 0, 0, 0, 0, 0, 'Y'),
	(94, 81, 0, 0, 0, 0, 0, 'Y'),
	(95, 82, 0, 0, 0, 0, 0, 'Y'),
	(96, 83, 0, 0, 0, 0, 0, 'Y');
/*!40000 ALTER TABLE `treasurys` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.treasury_logs
CREATE TABLE IF NOT EXISTS `treasury_logs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `id_shipping` int(11) NOT NULL,
  `id_log_type` int(11) NOT NULL,
  `value_process` float DEFAULT 0,
  `balance_previous` float DEFAULT 0,
  `balance_current` float DEFAULT 0,
  `date` datetime DEFAULT NULL,
  `active` enum('Y','N') NOT NULL DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=352 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.treasury_logs: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `treasury_logs` DISABLE KEYS */;
INSERT INTO `treasury_logs` (`id`, `id_shipping`, `id_log_type`, `value_process`, `balance_previous`, `balance_current`, `date`, `active`) VALUES
	(14, 1, 2, 18000, NULL, NULL, '2022-05-24 18:53:17', 'Y'),
	(15, 1, 2, 36000, NULL, NULL, '2022-05-24 14:00:02', 'Y'),
	(16, 2, 7, 30000, NULL, NULL, '2022-05-24 15:57:27', 'Y'),
	(32, 21, 7, 18000, 36000, 18000, '2022-05-26 10:22:18', 'Y'),
	(33, 21, 7, 18000, 18000, 0, '2022-05-26 10:22:18', 'Y'),
	(34, 21, 8, 18000, 0, 18000, '2022-05-26 11:34:28', 'Y'),
	(35, 21, 8, 18000, 18000, 36000, '2022-05-26 11:34:28', 'Y'),
	(36, 21, 7, 18000, 36000, 18000, '2022-05-26 11:36:27', 'Y'),
	(37, 21, 7, 18000, 18000, 0, '2022-05-26 11:36:27', 'Y'),
	(38, 21, 8, 18000, 0, 18000, '2022-05-26 11:36:37', 'Y'),
	(39, 21, 8, 18000, 18000, 36000, '2022-05-26 11:36:37', 'Y'),
	(42, 3, 2, 0, 0, 0, '2022-05-26 17:14:29', 'Y'),
	(44, 4, 2, 0, 0, 0, '2022-05-26 17:15:09', 'Y'),
	(46, 5, 2, 0, 0, 0, '2022-05-26 17:15:31', 'Y'),
	(48, 6, 2, 0, 0, 0, '2022-05-26 17:15:54', 'Y'),
	(50, 7, 2, 0, 0, 0, '2022-05-26 17:31:42', 'Y'),
	(52, 9, 2, 0, 0, 0, '2022-05-26 17:34:48', 'Y'),
	(53, 10, 1, 0, 0, 0, '2022-05-26 17:37:46', 'Y'),
	(54, 10, 2, 0, 0, 0, '2022-05-26 17:37:52', 'Y'),
	(55, 10, 4, 0, 0, 0, '2022-05-26 18:08:21', 'Y'),
	(56, 11, 1, 0, 0, 0, '2022-05-26 18:09:52', 'Y'),
	(57, 11, 2, 0, 0, 0, '2022-05-26 18:09:58', 'Y'),
	(58, 12, 1, 0, 0, 0, '2022-05-26 18:10:20', 'Y'),
	(59, 12, 2, 0, 0, 0, '2022-05-26 18:10:26', 'Y'),
	(60, 13, 1, 0, 0, 0, '2022-05-26 18:10:41', 'Y'),
	(61, 13, 4, 0, 0, 0, '2022-05-26 18:10:41', 'Y'),
	(62, 14, 1, 0, 0, 0, '2022-05-26 18:11:12', 'Y'),
	(63, 14, 2, 0, 0, 0, '2022-05-26 18:11:18', 'Y'),
	(64, 15, 1, 0, 0, 0, '2022-05-26 18:11:25', 'Y'),
	(65, 15, 2, 0, 0, 0, '2022-05-26 18:11:30', 'Y'),
	(66, 16, 1, 0, 0, 0, '2022-05-26 18:11:39', 'Y'),
	(67, 16, 4, 0, 0, 0, '2022-05-26 18:11:39', 'Y'),
	(68, 18, 1, 0, 0, 0, '2022-05-26 18:13:28', 'Y'),
	(69, 18, 2, 0, 0, 0, '2022-05-26 18:13:34', 'Y'),
	(70, 19, 1, 0, 0, 0, '2022-05-26 18:13:49', 'Y'),
	(71, 19, 2, 0, 0, 0, '2022-05-26 18:13:54', 'Y'),
	(72, 20, 1, 0, 0, 0, '2022-05-26 18:14:05', 'Y'),
	(73, 20, 2, 0, 0, 0, '2022-05-26 18:14:15', 'Y'),
	(74, 22, 1, 0, 0, 0, '2022-05-26 18:14:41', 'Y'),
	(75, 22, 2, 0, 0, 0, '2022-05-26 18:14:45', 'Y'),
	(76, 24, 1, 0, 0, 0, '2022-05-26 18:14:59', 'Y'),
	(77, 24, 2, 0, 0, 0, '2022-05-26 18:15:04', 'Y'),
	(78, 25, 1, 0, 0, 0, '2022-05-26 18:15:23', 'Y'),
	(79, 25, 4, 0, 0, 0, '2022-05-26 18:15:23', 'Y'),
	(80, 26, 1, 0, 0, 0, '2022-05-26 18:15:49', 'Y'),
	(81, 26, 2, 0, 0, 0, '2022-05-26 18:15:54', 'Y'),
	(82, 27, 1, 0, 0, 0, '2022-05-26 18:16:20', 'Y'),
	(83, 27, 2, 0, 0, 0, '2022-05-26 18:16:25', 'Y'),
	(84, 28, 1, 0, 0, 0, '2022-05-26 18:16:35', 'Y'),
	(85, 28, 2, 0, 0, 0, '2022-05-26 18:16:40', 'Y'),
	(86, 29, 1, 0, 0, 0, '2022-05-26 18:16:50', 'Y'),
	(87, 29, 2, 0, 0, 0, '2022-05-26 18:16:57', 'Y'),
	(88, 30, 1, 0, 0, 0, '2022-05-26 18:17:06', 'Y'),
	(89, 30, 2, 0, 0, 0, '2022-05-26 18:17:11', 'Y'),
	(90, 31, 1, 0, 0, 0, '2022-05-26 18:17:48', 'Y'),
	(91, 31, 2, 0, 0, 0, '2022-05-26 18:17:54', 'Y'),
	(92, 32, 1, 0, 0, 0, '2022-05-26 18:18:01', 'Y'),
	(93, 32, 2, 0, 0, 0, '2022-05-26 18:18:06', 'Y'),
	(94, 33, 1, 0, 0, 0, '2022-05-26 18:18:20', 'Y'),
	(95, 33, 2, 0, 0, 0, '2022-05-26 18:18:25', 'Y'),
	(96, 34, 1, 0, 0, 0, '2022-05-26 18:18:38', 'Y'),
	(97, 34, 2, 0, 0, 0, '2022-05-26 18:18:44', 'Y'),
	(98, 35, 1, 0, 0, 0, '2022-05-26 18:18:50', 'Y'),
	(99, 35, 2, 0, 0, 0, '2022-05-26 18:18:56', 'Y'),
	(100, 36, 1, 0, 0, 0, '2022-05-26 18:19:02', 'Y'),
	(101, 36, 2, 0, 0, 0, '2022-05-26 18:19:08', 'Y'),
	(102, 37, 1, 0, 0, 0, '2022-05-26 18:19:15', 'Y'),
	(103, 37, 2, 0, 0, 0, '2022-05-26 18:19:19', 'Y'),
	(104, 38, 1, 0, 0, 0, '2022-05-26 18:19:30', 'Y'),
	(105, 38, 2, 0, 0, 0, '2022-05-26 18:19:34', 'Y'),
	(106, 39, 1, 0, 0, 0, '2022-05-26 18:19:46', 'Y'),
	(107, 39, 2, 0, 0, 0, '2022-05-26 18:19:59', 'Y'),
	(108, 40, 1, 0, 0, 0, '2022-05-26 18:21:24', 'Y'),
	(109, 40, 2, 0, 0, 0, '2022-05-26 18:21:30', 'Y'),
	(110, 41, 1, 0, 0, 0, '2022-05-26 18:21:36', 'Y'),
	(111, 41, 2, 0, 0, 0, '2022-05-26 18:21:42', 'Y'),
	(112, 42, 1, 0, 0, 0, '2022-05-26 18:21:47', 'Y'),
	(113, 42, 2, 0, 0, 0, '2022-05-26 18:21:53', 'Y'),
	(114, 43, 1, 0, 0, 0, '2022-05-26 18:21:58', 'Y'),
	(115, 43, 2, 0, 0, 0, '2022-05-26 18:22:03', 'Y'),
	(116, 44, 1, 0, 0, 0, '2022-05-26 18:22:10', 'Y'),
	(117, 44, 2, 0, 0, 0, '2022-05-26 18:22:15', 'Y'),
	(118, 45, 1, 0, 0, 0, '2022-05-26 18:22:23', 'Y'),
	(119, 45, 2, 0, 0, 0, '2022-05-26 18:22:28', 'Y'),
	(120, 46, 1, 0, 0, 0, '2022-05-26 18:22:39', 'Y'),
	(121, 46, 2, 0, 0, 0, '2022-05-26 18:22:44', 'Y'),
	(122, 47, 1, 0, 0, 0, '2022-05-26 18:22:50', 'Y'),
	(123, 47, 2, 0, 0, 0, '2022-05-26 18:22:55', 'Y'),
	(124, 48, 1, 0, 0, 0, '2022-05-26 18:23:01', 'Y'),
	(125, 48, 2, 0, 0, 0, '2022-05-26 18:23:06', 'Y'),
	(126, 49, 1, 0, 0, 0, '2022-05-26 18:23:17', 'Y'),
	(127, 49, 2, 0, 0, 0, '2022-05-26 18:23:22', 'Y'),
	(128, 50, 1, 0, 0, 0, '2022-05-26 18:26:13', 'Y'),
	(129, 50, 2, 0, 0, 0, '2022-05-26 18:26:26', 'Y'),
	(130, 51, 1, 0, 0, 0, '2022-05-26 18:26:35', 'Y'),
	(131, 51, 2, 0, 0, 0, '2022-05-26 18:26:43', 'Y'),
	(132, 52, 1, 0, 0, 0, '2022-05-26 18:26:57', 'Y'),
	(133, 52, 2, 0, 0, 0, '2022-05-26 18:27:02', 'Y'),
	(134, 53, 1, 0, 0, 0, '2022-05-26 18:27:28', 'Y'),
	(135, 53, 2, 0, 0, 0, '2022-05-26 18:27:32', 'Y'),
	(136, 54, 1, 0, 0, 0, '2022-05-26 18:27:42', 'Y'),
	(137, 54, 4, 0, 0, 0, '2022-05-26 18:27:42', 'Y'),
	(138, 55, 1, 0, 0, 0, '2022-05-26 18:28:05', 'Y'),
	(139, 55, 2, 0, 0, 0, '2022-05-26 18:28:13', 'Y'),
	(140, 56, 1, 0, 0, 0, '2022-05-26 18:28:29', 'Y'),
	(141, 56, 2, 0, 0, 0, '2022-05-26 18:28:35', 'Y'),
	(142, 57, 1, 0, 0, 0, '2022-05-26 18:28:46', 'Y'),
	(143, 57, 2, 0, 0, 0, '2022-05-26 18:28:55', 'Y'),
	(144, 58, 1, 0, 0, 0, '2022-05-26 18:29:02', 'Y'),
	(145, 58, 2, 0, 0, 0, '2022-05-26 18:29:07', 'Y'),
	(146, 59, 1, 0, 0, 0, '2022-05-26 18:29:15', 'Y'),
	(147, 59, 2, 0, 0, 0, '2022-05-26 18:29:20', 'Y'),
	(148, 60, 1, 0, 0, 0, '2022-05-26 18:29:26', 'Y'),
	(149, 60, 2, 0, 0, 0, '2022-05-26 18:29:34', 'Y'),
	(150, 61, 1, 0, 0, 0, '2022-05-26 18:30:17', 'Y'),
	(151, 61, 2, 0, 0, 0, '2022-05-26 18:30:23', 'Y'),
	(152, 62, 1, 0, 0, 0, '2022-05-26 18:30:32', 'Y'),
	(153, 62, 2, 0, 0, 0, '2022-05-26 18:30:38', 'Y'),
	(154, 63, 1, 0, 0, 0, '2022-05-26 18:30:49', 'Y'),
	(155, 63, 2, 0, 0, 0, '2022-05-26 18:30:56', 'Y'),
	(156, 64, 1, 0, 0, 0, '2022-05-26 18:31:14', 'Y'),
	(157, 64, 2, 0, 0, 0, '2022-05-26 18:31:20', 'Y'),
	(158, 65, 1, 0, 0, 0, '2022-05-26 18:31:26', 'Y'),
	(159, 66, 1, 0, 0, 0, '2022-05-26 18:32:24', 'Y'),
	(160, 66, 2, 0, 0, 0, '2022-05-26 18:32:30', 'Y'),
	(161, 67, 1, 0, 0, 0, '2022-05-26 18:32:41', 'Y'),
	(162, 67, 2, 0, 0, 0, '2022-05-26 18:32:46', 'Y'),
	(163, 68, 1, 0, 0, 0, '2022-05-26 18:32:52', 'Y'),
	(164, 68, 2, 0, 0, 0, '2022-05-26 18:32:58', 'Y'),
	(165, 69, 1, 0, 0, 0, '2022-05-26 18:33:04', 'Y'),
	(166, 69, 2, 0, 0, 0, '2022-05-26 18:33:09', 'Y'),
	(167, 70, 1, 0, 0, 0, '2022-05-26 18:33:16', 'Y'),
	(168, 70, 2, 0, 0, 0, '2022-05-26 18:33:21', 'Y'),
	(169, 71, 1, 0, 0, 0, '2022-05-26 18:33:28', 'Y'),
	(170, 71, 2, 0, 0, 0, '2022-05-26 18:33:33', 'Y'),
	(171, 72, 1, 0, 0, 0, '2022-05-26 18:33:38', 'Y'),
	(172, 72, 2, 0, 0, 0, '2022-05-26 18:33:43', 'Y'),
	(173, 73, 1, 0, 0, 0, '2022-05-26 18:33:49', 'Y'),
	(174, 73, 2, 0, 0, 0, '2022-05-26 18:33:57', 'Y'),
	(175, 74, 1, 0, 0, 0, '2022-05-26 18:34:04', 'Y'),
	(176, 74, 2, 0, 0, 0, '2022-05-26 18:34:09', 'Y'),
	(177, 75, 1, 0, 0, 0, '2022-05-26 18:34:14', 'Y'),
	(178, 75, 2, 0, 0, 0, '2022-05-26 18:34:19', 'Y'),
	(179, 76, 1, 0, 0, 0, '2022-05-26 18:34:26', 'Y'),
	(180, 76, 2, 0, 0, 0, '2022-05-26 18:34:45', 'Y'),
	(181, 77, 1, 0, 0, 0, '2022-05-26 18:35:01', 'Y'),
	(182, 77, 2, 0, 0, 0, '2022-05-26 18:35:06', 'Y'),
	(183, 78, 1, 0, 0, 0, '2022-05-26 18:35:13', 'Y'),
	(184, 78, 2, 0, 0, 0, '2022-05-26 18:35:18', 'Y'),
	(185, 444, 1, 0, 0, 0, '2022-05-26 18:35:24', 'Y'),
	(186, 444, 2, 0, 0, 0, '2022-05-26 18:35:29', 'Y'),
	(187, 555, 1, 0, 0, 0, '2022-05-26 18:35:34', 'Y'),
	(188, 555, 2, 0, 0, 0, '2022-05-26 18:35:39', 'Y'),
	(189, 3, 4, 0, 0, 0, '2022-05-30 22:43:42', 'Y'),
	(190, 4, 4, 0, 0, 0, '2022-05-30 22:43:49', 'Y'),
	(191, 5, 4, 0, 0, 0, '2022-05-30 22:43:55', 'Y'),
	(192, 6, 5, 0, 0, 0, '2022-05-30 22:44:05', 'Y'),
	(193, 7, 5, 0, 0, 0, '2022-05-30 22:44:13', 'Y'),
	(194, 8, 5, 0, 0, 0, '2022-05-30 22:44:21', 'Y'),
	(195, 9, 5, 0, 0, 0, '2022-05-30 22:44:29', 'Y'),
	(196, 10, 4, 0, 0, 0, '2022-05-30 22:44:38', 'Y'),
	(197, 11, 5, 0, 0, 0, '2022-05-30 22:44:50', 'Y'),
	(198, 12, 5, 0, 0, 0, '2022-05-30 22:44:58', 'Y'),
	(199, 13, 4, 0, 0, 0, '2022-05-30 22:45:07', 'Y'),
	(200, 14, 5, 0, 0, 0, '2022-05-30 22:45:15', 'Y'),
	(201, 15, 5, 0, 0, 0, '2022-05-30 22:45:26', 'Y'),
	(202, 16, 4, 0, 0, 0, '2022-05-30 22:45:34', 'Y'),
	(203, 67, 5, 0, 0, 0, '2022-05-30 22:51:00', 'Y'),
	(204, 75, 5, 0, 0, 0, '2022-05-30 22:51:24', 'Y'),
	(205, 444, 5, 0, 0, 0, '2022-05-30 23:07:42', 'Y'),
	(206, 555, 5, 0, 0, 0, '2022-05-30 23:07:53', 'Y'),
	(207, 2, 5, 0, 0, 0, '2022-05-31 11:04:05', 'Y'),
	(208, 3, 4, 0, 0, 0, '2022-05-31 11:04:14', 'Y'),
	(209, 4, 4, 0, 0, 0, '2022-05-31 11:04:25', 'Y'),
	(210, 7, 5, 0, 0, 0, '2022-05-31 11:18:29', 'Y'),
	(211, 8, 5, 0, 0, 0, '2022-05-31 11:23:38', 'Y'),
	(212, 8, 5, 0, 0, 0, '2022-05-31 11:24:14', 'Y'),
	(213, 9, 5, 0, 0, 0, '2022-05-31 11:26:25', 'Y'),
	(214, 11, 5, 0, 0, 0, '2022-05-31 11:27:00', 'Y'),
	(215, 12, 5, 0, 0, 0, '2022-05-31 11:27:47', 'Y'),
	(216, 14, 5, 0, 0, 0, '2022-05-31 11:28:09', 'Y'),
	(217, 15, 5, 0, 0, 0, '2022-05-31 11:28:26', 'Y'),
	(218, 17, 5, 0, 0, 0, '2022-05-31 11:28:49', 'Y'),
	(219, 18, 5, 0, 0, 0, '2022-05-31 11:29:04', 'Y'),
	(220, 19, 5, 0, 0, 0, '2022-05-31 11:29:20', 'Y'),
	(221, 20, 5, 0, 0, 0, '2022-05-31 11:29:44', 'Y'),
	(222, 21, 5, 0, 36000, 36000, '2022-05-31 11:31:25', 'Y'),
	(223, 22, 5, 0, 0, 0, '2022-05-31 11:31:43', 'Y'),
	(224, 23, 5, 0, 18000, 18000, '2022-05-31 11:31:59', 'Y'),
	(225, 24, 5, 0, 0, 0, '2022-05-31 11:32:14', 'Y'),
	(226, 26, 5, 0, 0, 0, '2022-05-31 11:32:33', 'Y'),
	(227, 27, 5, 0, 0, 0, '2022-05-31 11:32:51', 'Y'),
	(228, 28, 5, 0, 0, 0, '2022-05-31 11:33:19', 'Y'),
	(229, 29, 5, 0, 0, 0, '2022-05-31 11:33:36', 'Y'),
	(230, 30, 5, 0, 0, 0, '2022-05-31 11:33:54', 'Y'),
	(231, 31, 5, 0, 0, 0, '2022-05-31 11:34:12', 'Y'),
	(232, 32, 5, 0, 0, 0, '2022-05-31 11:34:35', 'Y'),
	(233, 33, 5, 0, 0, 0, '2022-05-31 11:34:54', 'Y'),
	(234, 34, 5, 0, 0, 0, '2022-05-31 11:41:05', 'Y'),
	(235, 35, 5, 0, 0, 0, '2022-05-31 11:41:23', 'Y'),
	(236, 36, 5, 0, 0, 0, '2022-05-31 11:41:38', 'Y'),
	(237, 37, 5, 0, 0, 0, '2022-05-31 11:41:52', 'Y'),
	(238, 38, 5, 0, 0, 0, '2022-05-31 11:42:07', 'Y'),
	(239, 39, 5, 0, 0, 0, '2022-05-31 11:42:23', 'Y'),
	(240, 40, 5, 0, 0, 0, '2022-05-31 11:42:36', 'Y'),
	(241, 41, 5, 0, 0, 0, '2022-05-31 11:42:59', 'Y'),
	(242, 42, 5, 0, 0, 0, '2022-05-31 11:43:14', 'Y'),
	(243, 43, 5, 0, 0, 0, '2022-05-31 11:43:34', 'Y'),
	(244, 44, 5, 0, 0, 0, '2022-05-31 11:43:58', 'Y'),
	(245, 45, 5, 0, 0, 0, '2022-05-31 11:44:14', 'Y'),
	(246, 46, 5, 0, 0, 0, '2022-05-31 11:44:30', 'Y'),
	(247, 47, 5, 0, 0, 0, '2022-05-31 11:44:46', 'Y'),
	(248, 48, 5, 0, 0, 0, '2022-05-31 11:45:01', 'Y'),
	(249, 50, 5, 0, 0, 0, '2022-05-31 11:45:18', 'Y'),
	(250, 51, 5, 0, 0, 0, '2022-05-31 11:45:34', 'Y'),
	(251, 52, 5, 0, 0, 0, '2022-05-31 11:45:48', 'Y'),
	(252, 53, 5, 0, 0, 0, '2022-05-31 11:46:05', 'Y'),
	(253, 55, 5, 0, 0, 0, '2022-05-31 11:46:24', 'Y'),
	(254, 56, 5, 0, 0, 0, '2022-05-31 11:46:41', 'Y'),
	(255, 57, 5, 0, 0, 0, '2022-05-31 11:46:58', 'Y'),
	(256, 58, 5, 0, 0, 0, '2022-05-31 11:47:17', 'Y'),
	(257, 59, 5, 0, 0, 0, '2022-05-31 11:47:36', 'Y'),
	(258, 60, 5, 0, 0, 0, '2022-05-31 11:47:59', 'Y'),
	(259, 61, 5, 0, 0, 0, '2022-05-31 11:48:19', 'Y'),
	(260, 62, 5, 0, 0, 0, '2022-05-31 11:48:36', 'Y'),
	(261, 64, 5, 0, 0, 0, '2022-05-31 11:48:55', 'Y'),
	(262, 65, 5, 0, 0, 0, '2022-05-31 11:49:13', 'Y'),
	(263, 66, 5, 0, 0, 0, '2022-05-31 11:49:32', 'Y'),
	(264, 67, 5, 0, 0, 0, '2022-05-31 11:49:50', 'Y'),
	(265, 68, 5, 0, 0, 0, '2022-05-31 11:50:08', 'Y'),
	(266, 69, 5, 0, 0, 0, '2022-05-31 11:50:27', 'Y'),
	(267, 70, 5, 0, 0, 0, '2022-05-31 11:50:48', 'Y'),
	(268, 71, 5, 0, 0, 0, '2022-05-31 11:51:08', 'Y'),
	(269, 72, 5, 0, 0, 0, '2022-05-31 11:51:24', 'Y'),
	(270, 73, 5, 0, 0, 0, '2022-05-31 11:51:41', 'Y'),
	(271, 74, 5, 0, 0, 0, '2022-05-31 11:52:00', 'Y'),
	(272, 75, 5, 0, 0, 0, '2022-05-31 11:52:18', 'Y'),
	(273, 76, 5, 0, 0, 0, '2022-05-31 11:52:36', 'Y'),
	(274, 77, 5, 0, 0, 0, '2022-05-31 11:52:52', 'Y'),
	(275, 78, 5, 0, 0, 0, '2022-05-31 11:53:09', 'Y'),
	(276, 79, 1, 0, 0, 0, '2022-05-31 12:18:28', 'Y'),
	(277, 50, 5, 0, 0, 0, '2022-05-31 15:31:06', 'Y'),
	(278, 50, 5, 0, 0, 0, '2022-05-31 15:32:42', 'Y'),
	(279, 30, 5, 0, 0, 0, '2022-05-31 15:33:17', 'Y'),
	(280, 51, 5, 0, 0, 0, '2022-05-31 15:33:27', 'Y'),
	(281, 40, 5, 0, 0, 0, '2022-05-31 15:33:43', 'Y'),
	(282, 66, 5, 0, 0, 0, '2022-05-31 15:33:55', 'Y'),
	(283, 36, 5, 0, 0, 0, '2022-05-31 15:34:16', 'Y'),
	(284, 48, 5, 0, 0, 0, '2022-05-31 15:34:30', 'Y'),
	(285, 45, 5, 0, 0, 0, '2022-05-31 15:34:46', 'Y'),
	(286, 42, 5, 0, 0, 0, '2022-05-31 15:34:56', 'Y'),
	(287, 21, 5, 0, 36000, 36000, '2022-05-31 15:35:08', 'Y'),
	(288, 53, 5, 0, 0, 0, '2022-05-31 15:35:19', 'Y'),
	(289, 20, 5, 0, 0, 0, '2022-05-31 15:35:32', 'Y'),
	(290, 37, 5, 0, 0, 0, '2022-05-31 15:35:44', 'Y'),
	(291, 27, 5, 0, 0, 0, '2022-05-31 15:36:00', 'Y'),
	(292, 46, 5, 0, 0, 0, '2022-05-31 15:36:11', 'Y'),
	(293, 44, 5, 0, 0, 0, '2022-05-31 15:36:24', 'Y'),
	(294, 19, 5, 0, 0, 0, '2022-05-31 15:36:34', 'Y'),
	(295, 22, 5, 0, 0, 0, '2022-05-31 15:36:47', 'Y'),
	(296, 35, 5, 0, 0, 0, '2022-05-31 15:37:12', 'Y'),
	(297, 34, 5, 0, 0, 0, '2022-05-31 15:37:25', 'Y'),
	(298, 43, 5, 0, 0, 0, '2022-05-31 15:37:49', 'Y'),
	(299, 67, 5, 0, 0, 0, '2022-05-31 15:38:02', 'Y'),
	(300, 52, 5, 0, 0, 0, '2022-05-31 15:38:14', 'Y'),
	(301, 33, 5, 0, 0, 0, '2022-05-31 15:38:27', 'Y'),
	(302, 26, 5, 0, 0, 0, '2022-05-31 15:38:38', 'Y'),
	(303, 28, 5, 0, 0, 0, '2022-05-31 15:38:52', 'Y'),
	(304, 31, 5, 0, 0, 0, '2022-05-31 15:39:05', 'Y'),
	(305, 38, 5, 0, 0, 0, '2022-05-31 15:39:27', 'Y'),
	(306, 57, 5, 0, 0, 0, '2022-05-31 15:39:46', 'Y'),
	(307, 69, 5, 0, 0, 0, '2022-05-31 15:40:13', 'Y'),
	(308, 64, 5, 0, 0, 0, '2022-05-31 15:40:25', 'Y'),
	(309, 70, 5, 0, 0, 0, '2022-05-31 15:40:37', 'Y'),
	(310, 23, 5, 0, 18000, 18000, '2022-05-31 15:40:49', 'Y'),
	(311, 72, 5, 0, 0, 0, '2022-05-31 15:41:02', 'Y'),
	(312, 47, 5, 0, 0, 0, '2022-05-31 15:41:14', 'Y'),
	(313, 41, 5, 0, 0, 0, '2022-05-31 15:41:34', 'Y'),
	(314, 39, 5, 0, 0, 0, '2022-05-31 15:41:44', 'Y'),
	(315, 55, 5, 0, 0, 0, '2022-05-31 15:42:45', 'Y'),
	(316, 32, 5, 0, 0, 0, '2022-05-31 15:43:01', 'Y'),
	(317, 58, 5, 0, 0, 0, '2022-05-31 15:43:11', 'Y'),
	(318, 60, 5, 0, 0, 0, '2022-05-31 15:43:30', 'Y'),
	(319, 59, 5, 0, 0, 0, '2022-05-31 15:43:42', 'Y'),
	(320, 62, 5, 0, 0, 0, '2022-05-31 15:43:52', 'Y'),
	(321, 68, 5, 0, 0, 0, '2022-05-31 15:44:07', 'Y'),
	(322, 71, 5, 0, 0, 0, '2022-05-31 15:44:21', 'Y'),
	(323, 61, 5, 0, 0, 0, '2022-05-31 15:44:38', 'Y'),
	(324, 72, 5, 0, 0, 0, '2022-05-31 15:45:47', 'Y'),
	(325, 76, 5, 0, 0, 0, '2022-05-31 15:46:06', 'Y'),
	(326, 73, 5, 0, 0, 0, '2022-05-31 15:46:21', 'Y'),
	(327, 74, 5, 0, 0, 0, '2022-05-31 15:46:35', 'Y'),
	(328, 78, 5, 0, 0, 0, '2022-05-31 15:46:50', 'Y'),
	(329, 77, 5, 0, 0, 0, '2022-05-31 15:47:06', 'Y'),
	(330, 18, 5, 0, 0, 0, '2022-05-31 15:47:27', 'Y'),
	(331, 17, 5, 0, 0, 0, '2022-05-31 15:47:37', 'Y'),
	(332, 56, 5, 0, 0, 0, '2022-05-31 15:47:48', 'Y'),
	(333, 24, 5, 0, 0, 0, '2022-05-31 15:48:00', 'Y'),
	(334, 29, 5, 0, 0, 0, '2022-05-31 15:48:11', 'Y'),
	(335, 6, 4, 0, 0, 0, '2022-06-03 13:52:54', 'Y'),
	(336, 23, 4, 0, 18000, 18000, '2022-06-03 13:53:09', 'Y'),
	(337, 23, 5, 0, 18000, 18000, '2022-06-03 13:53:21', 'Y'),
	(338, 80, 1, 0, 0, 0, '2022-06-30 15:05:49', 'Y'),
	(339, 81, 1, 0, 0, 0, '2022-06-30 15:07:16', 'Y'),
	(340, 82, 1, 0, 0, 0, '2022-06-30 15:08:21', 'Y'),
	(341, 83, 1, 0, 0, 0, '2022-06-30 15:09:20', 'Y'),
	(342, 79, 5, 0, 0, 0, '2022-06-30 15:31:21', 'Y'),
	(343, 21, 7, 18000, 36000, 18000, '2022-06-30 15:54:38', 'Y'),
	(344, 21, 7, 18000, 18000, 0, '2022-06-30 16:05:08', 'Y'),
	(345, 21, 7, 18000, 36000, 18000, '2022-06-30 16:07:12', 'Y'),
	(346, 21, 7, 18000, 18000, 0, '2022-06-30 16:07:37', 'Y'),
	(347, 21, 7, 18000, 36000, 18000, '2022-06-30 16:12:56', 'Y'),
	(348, 21, 7, 18000, 18000, 0, '2022-06-30 16:47:00', 'Y'),
	(349, 23, 7, 9000, 18000, 9000, '2022-06-30 17:32:44', 'Y'),
	(350, 23, 7, 9000, 9000, 0, '2022-06-30 17:32:44', 'Y'),
	(351, 21, 2, 18000, 0, 18000, '2022-06-30 22:28:30', 'Y');
/*!40000 ALTER TABLE `treasury_logs` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.treasury_log_types
CREATE TABLE IF NOT EXISTS `treasury_log_types` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `active` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.treasury_log_types: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `treasury_log_types` DISABLE KEYS */;
INSERT INTO `treasury_log_types` (`id`, `name`, `active`) VALUES
	(1, 'Criação', 'Y'),
	(2, 'Entrada', 'Y'),
	(3, 'Saida', 'Y'),
	(4, 'Inativação', 'Y'),
	(5, 'Ativação', 'Y'),
	(6, 'Exclusão', 'Y'),
	(7, 'Abastecimento', 'Y'),
	(8, 'Canc. Abastecimento', 'Y');
/*!40000 ALTER TABLE `treasury_log_types` ENABLE KEYS */;

-- Copiando estrutura para tabela crednosso.users
CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(100) DEFAULT NULL,
  `username` varchar(100) DEFAULT NULL,
  `email` varchar(200) DEFAULT NULL,
  `password` varchar(255) DEFAULT NULL,
  `nivel` enum('admin','user') NOT NULL DEFAULT 'user',
  `token` varchar(253) DEFAULT NULL,
  `date_login` date DEFAULT NULL,
  `change_date` datetime DEFAULT NULL,
  `active` enum('Y','N') DEFAULT 'Y',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8;

-- Copiando dados para a tabela crednosso.users: ~0 rows (aproximadamente)
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` (`id`, `name`, `username`, `email`, `password`, `nivel`, `token`, `date_login`, `change_date`, `active`) VALUES
	(1, 'Tarcisio Silva', 'TARCISIOSILVA', 'tarcisio.silva@crednosso.com.br', '$2y$10$YW7P6YfkEzFg0asoolofV.J.CvvKl.jGVZyYpiZmrz0Ff/iM3JzNi', 'admin', '$2y$10$9.zqM2gmuDhxZJUINkDJf.0y3OZDkX9hBzC0S8Y2mzl26J/4B1NTC', NULL, NULL, 'Y'),
	(2, 'Dillan Andrew', 'DILLANSOUSA', 'dillan.sousa@crednosso.com.br', '$2y$10$s4196SsNI.4nNFNtfop3c.gItB3.lffP/gsGfUH24s/NlY4O886TC', 'user', NULL, NULL, NULL, 'Y'),
	(6, 'teste teste', 'TESTETESTE', 'teste@teste.com', '$2y$10$7AP.N2zJndZy2PuV0Do16exjsQVxPADqPrj2bVttSvGShMaUjXnqK', 'user', NULL, NULL, NULL, 'N');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;

/*!40101 SET SQL_MODE=IFNULL(@OLD_SQL_MODE, '') */;
/*!40014 SET FOREIGN_KEY_CHECKS=IF(@OLD_FOREIGN_KEY_CHECKS IS NULL, 1, @OLD_FOREIGN_KEY_CHECKS) */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
