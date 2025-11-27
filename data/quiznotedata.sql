-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: quiznote
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `chapters`
--

DROP TABLE IF EXISTS `chapters`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `chapters` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `name` varchar(255) NOT NULL,
  `subject_id` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3rm6snrkx0k8xyqn7017b0v41` (`subject_id`),
  CONSTRAINT `FK3rm6snrkx0k8xyqn7017b0v41` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `chapters`
--

LOCK TABLES `chapters` WRITE;
/*!40000 ALTER TABLE `chapters` DISABLE KEYS */;
INSERT INTO `chapters` VALUES (2,'1: Tổng quá về hệ điều hành',1,'2025-10-04 06:53:59.244520','admin@gmail.com','2025-10-04 06:55:19.346363','admin@gmail.com'),(3,'Chuong 2: Bai hoc',1,'2025-10-04 06:55:04.289454','admin@gmail.com',NULL,NULL),(4,'Bài 2',1,'2025-11-04 17:02:56.845710','admin@gmail.com',NULL,NULL);
/*!40000 ALTER TABLE `chapters` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `comments`
--

DROP TABLE IF EXISTS `comments`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `comments` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(2000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `rating` int DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `parent_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKlri30okf66phtcgbe5pok7cc0` (`parent_id`),
  KEY `FKopu7255kldgi6rra26gxnkn3k` (`subject_id`),
  KEY `FK8omq0tc18jd43bu5tjh6jvraq` (`user_id`),
  CONSTRAINT `FK8omq0tc18jd43bu5tjh6jvraq` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKlri30okf66phtcgbe5pok7cc0` FOREIGN KEY (`parent_id`) REFERENCES `comments` (`id`),
  CONSTRAINT `FKopu7255kldgi6rra26gxnkn3k` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `comments`
--

LOCK TABLES `comments` WRITE;
/*!40000 ALTER TABLE `comments` DISABLE KEYS */;
INSERT INTO `comments` VALUES (1,'Đề thi rất hay, câu hỏi sát chương trình học.','2025-11-01 13:17:07.187936',5,NULL,NULL,1,1),(2,'Một số câu hơi đánh đố, nhưng nhìn chung hợp lý.','2025-11-01 13:17:54.085413',4,NULL,NULL,1,1),(3,'Giúp mình ôn thi dễ hơn nhiều, cảm ơn tác giả!','2025-11-01 13:18:04.210521',5,NULL,NULL,1,1),(4,'Đề khá khó, nhưng đúng trọng tâm môn học.','2025-11-01 13:18:36.563156',4,NULL,NULL,1,1),(5,'Giao diện làm bài mượt, đáp án rõ ràng, đáng tiền.','2025-11-01 13:18:48.564906',5,NULL,NULL,1,1),(6,'Cần cập nhật thêm vài câu mới, một số câu trùng.','2025-11-01 13:18:56.489155',3,NULL,NULL,1,1),(7,'Làm xong biết ngay điểm, rất tiện lợi!','2025-11-01 13:19:03.394126',5,NULL,NULL,1,1),(8,'Hợp với người mới học, giải thích chi tiết.','2025-11-01 13:19:11.356032',5,NULL,NULL,1,1),(13,'shop xin lỗi vì sự bất tiện này','2025-11-01 13:36:11.151537',NULL,NULL,6,1,1),(15,'hay','2025-11-19 14:33:04.054964',5,NULL,NULL,1,2),(19,'hay','2025-11-21 08:07:11.721503',5,NULL,NULL,23,2),(20,'hay','2025-11-21 08:09:09.488590',5,NULL,NULL,13,2),(21,'hay','2025-11-21 08:09:20.329377',5,NULL,NULL,3,2),(22,'rất hay','2025-11-23 05:16:34.622052',5,NULL,NULL,23,7),(23,'cảm ơn ạ','2025-11-23 22:03:16.954082',NULL,NULL,19,23,9);
/*!40000 ALTER TABLE `comments` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `payment_transactions`
--

DROP TABLE IF EXISTS `payment_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `payment_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` bigint DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `order_info` varchar(255) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `payment_time` varchar(255) DEFAULT NULL,
  `status` varchar(255) DEFAULT NULL,
  `transaction_no` varchar(255) DEFAULT NULL,
  `buyer_id` bigint DEFAULT NULL,
  `seller_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKs9tpxlddsx5gebwpqoy4tbb56` (`buyer_id`),
  KEY `FKhcpgc428hgi46ksllwyv1flwt` (`seller_id`),
  KEY `FKjwdkd4tbge5davtbtoo86vrry` (`subject_id`),
  CONSTRAINT `FKhcpgc428hgi46ksllwyv1flwt` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKjwdkd4tbge5davtbtoo86vrry` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`),
  CONSTRAINT `FKs9tpxlddsx5gebwpqoy4tbb56` FOREIGN KEY (`buyer_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=28 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `payment_transactions`
--

LOCK TABLES `payment_transactions` WRITE;
/*!40000 ALTER TABLE `payment_transactions` DISABLE KEYS */;
INSERT INTO `payment_transactions` VALUES (1,50000,'2025-10-16 06:10:44.988937','buyer:1;subject:1','VNPAY','20251016131218','SUCCESS','15205931',1,1,1),(2,50000,'2025-10-24 06:21:42.157395','buyer:1;subject:1','VNPAY','20251024132319','SUCCESS','15217042',1,1,1),(3,500000,'2025-11-07 09:38:22.435126','buyer:2;subject:11','VNPAY','20251107163813','SUCCESS','15245198',2,1,11),(4,500000,'2025-11-07 09:44:07.975501','buyer:2;subject:11','VNPAY','20251107164348','SUCCESS','15245223',2,1,11),(5,500000,'2025-11-07 09:51:23.412501','buyer:2;subject:11','VNPAY','20251107165114','SUCCESS','15245254',2,1,11),(6,500000,'2025-11-07 09:54:38.223317','buyer:2;subject:11','VNPAY','20251107165430','SUCCESS','15245259',2,1,11),(7,500000,'2025-11-07 10:02:03.505136','buyer:2;subject:11','VNPAY','20251107170154','SUCCESS','15245272',2,1,11),(8,500000,'2025-11-07 10:05:45.184173','buyer:2;subject:11','VNPAY','20251107170536','SUCCESS','15245281',2,1,11),(9,500000,'2025-11-07 10:09:57.981375','buyer:2;subject:11','VNPAY','20251107170949','SUCCESS','15245293',2,1,11),(10,20000,'2025-11-12 14:52:44.994037','buyer:2;subject:13','VNPAY','20251112215235','SUCCESS','15256920',2,1,13),(11,20000,'2025-11-12 14:53:50.766556','buyer:2;subject:13','VNPAY','20251112215338','SUCCESS','15256922',2,1,13),(12,500000,'2025-11-12 14:56:46.655820','buyer:2;subject:11','VNPAY','20251112215636','SUCCESS','15256929',2,1,11),(13,20000,'2025-11-12 15:00:55.511991','buyer:2;subject:13','VNPAY','20251112220046','SUCCESS','15256945',2,1,13),(22,20000,'2025-11-20 07:13:19.979779','buyer:2;subject:20','VNPAY','20251120141308','SUCCESS','15272207',2,9,20),(23,20000,'2025-11-20 15:09:53.094996','buyer:2;subject:23','VNPAY','20251120220929','SUCCESS','15273554',2,9,23),(24,130000,'2025-11-21 08:11:25.248937','buyer:2;subject:6','VNPAY','20251121151114','SUCCESS','15276500',2,1,6),(25,120000,'2025-11-21 11:01:48.041615','buyer:2;subject:2','VNPAY','20251121180133','FAILED','0',2,1,2),(26,20000,'2025-11-23 05:16:12.078907','buyer:7;subject:23','VNPAY','20251123121604','SUCCESS','15281805',7,9,23),(27,120000,'2025-11-23 10:36:44.293990','buyer:2;subject:2','VNPAY','20251123173637','SUCCESS','15282312',2,1,2);
/*!40000 ALTER TABLE `payment_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permission_role`
--

DROP TABLE IF EXISTS `permission_role`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permission_role` (
  `role_id` bigint NOT NULL,
  `permission_id` bigint NOT NULL,
  KEY `FK6mg4g9rc8u87l0yavf8kjut05` (`permission_id`),
  KEY `FK3vhflqw0lwbwn49xqoivrtugt` (`role_id`),
  CONSTRAINT `FK3vhflqw0lwbwn49xqoivrtugt` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`),
  CONSTRAINT `FK6mg4g9rc8u87l0yavf8kjut05` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permission_role`
--

LOCK TABLES `permission_role` WRITE;
/*!40000 ALTER TABLE `permission_role` DISABLE KEYS */;
INSERT INTO `permission_role` VALUES (4,19),(4,20),(4,21),(4,22),(4,23),(4,24),(4,25),(4,27),(4,29),(4,30),(4,31),(4,32),(4,33),(4,34),(4,35),(4,36),(4,37),(4,38),(4,39),(4,40),(4,41),(4,42),(4,43),(4,44),(4,45),(4,46),(4,47),(4,55),(4,56),(4,57),(4,58),(4,59),(4,60),(4,62),(4,67),(4,68),(4,71),(2,9),(2,10),(2,14),(2,15),(2,19),(2,20),(2,21),(2,24),(2,25),(2,26),(2,27),(2,29),(2,30),(2,34),(2,41),(2,43),(2,44),(2,46),(2,48),(2,49),(2,50),(2,51),(2,52),(2,53),(2,54),(2,55),(2,56),(2,57),(2,58),(2,59),(2,60),(2,61),(2,62),(2,67),(2,68),(2,69),(2,72),(2,78),(2,79),(2,80),(2,81),(2,82),(2,83),(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),(1,10),(1,11),(1,12),(1,13),(1,14),(1,15),(1,18),(1,19),(1,20),(1,21),(1,22),(1,23),(1,24),(1,25),(1,26),(1,27),(1,28),(1,29),(1,30),(1,31),(1,32),(1,33),(1,34),(1,35),(1,36),(1,37),(1,38),(1,39),(1,40),(1,41),(1,42),(1,43),(1,44),(1,45),(1,46),(1,47),(1,48),(1,49),(1,50),(1,51),(1,52),(1,53),(1,54),(1,55),(1,56),(1,57),(1,58),(1,59),(1,60),(1,61),(1,62),(1,63),(1,64),(1,65),(1,66),(1,67),(1,68),(1,69),(1,70),(1,71),(1,72),(1,73),(1,74),(1,75),(1,76),(1,77),(1,78),(1,79),(1,80),(1,81),(1,82),(1,83),(1,84),(1,85),(1,86),(1,87),(1,88),(1,89),(1,90);
/*!40000 ALTER TABLE `permission_role` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `permissions`
--

DROP TABLE IF EXISTS `permissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `permissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `api_path` varchar(255) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `method` varchar(255) NOT NULL,
  `module` varchar(255) NOT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=91 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `permissions`
--

LOCK TABLES `permissions` WRITE;
/*!40000 ALTER TABLE `permissions` DISABLE KEYS */;
INSERT INTO `permissions` VALUES (1,'/api/v1/permissions','2025-10-30 14:52:20.476875','anonymous','POST','PERMISSIONS','Create a permission',NULL,NULL),(2,'/api/v1/permissions','2025-10-30 14:52:21.052248','anonymous','PUT','PERMISSIONS','Update a permission',NULL,NULL),(3,'/api/v1/permissions/{id}','2025-10-30 14:52:21.062253','anonymous','DELETE','PERMISSIONS','Delete a permission',NULL,NULL),(4,'/api/v1/permissions/{id}','2025-10-30 14:52:21.067098','anonymous','GET','PERMISSIONS','Get a permission by id',NULL,NULL),(5,'/api/v1/permissions','2025-10-30 14:52:21.073064','anonymous','GET','PERMISSIONS','Get permissions with pagination',NULL,NULL),(6,'/api/v1/roles','2025-10-30 14:52:21.077999','anonymous','POST','ROLES','Create a role',NULL,NULL),(7,'/api/v1/roles','2025-10-30 14:52:21.083997','anonymous','PUT','ROLES','Update a role',NULL,NULL),(8,'/api/v1/roles/{id}','2025-10-30 14:52:21.089522','anonymous','DELETE','ROLES','Delete a role',NULL,NULL),(9,'/api/v1/roles/{id}','2025-10-30 14:52:21.094550','anonymous','GET','ROLES','Get a role by id',NULL,NULL),(10,'/api/v1/roles','2025-10-30 14:52:21.099550','anonymous','GET','ROLES','Get roles with pagination',NULL,NULL),(11,'/api/v1/users','2025-10-30 14:52:21.103551','anonymous','POST','USERS','Create a user',NULL,NULL),(12,'/api/v1/users','2025-10-30 14:52:21.109554','anonymous','PUT','USERS','Update a user',NULL,NULL),(13,'/api/v1/users/{id}','2025-10-30 14:52:21.113917','anonymous','DELETE','USERS','Delete a user',NULL,NULL),(14,'/api/v1/users/{id}','2025-10-30 14:52:21.120961','anonymous','GET','USERS','Get a user by id',NULL,NULL),(15,'/api/v1/users','2025-10-30 14:52:21.125952','anonymous','GET','USERS','Get users with pagination',NULL,NULL),(18,'/api/v1/subjects/{id}','2025-10-30 14:52:21.141945','anonymous','DELETE','SUBJECTS','Delete a subject',NULL,NULL),(19,'/api/v1/subjects/{id}','2025-10-30 14:52:21.146946','anonymous','GET','SUBJECTS','Get a subject by id',NULL,NULL),(20,'/api/v1/subjects','2025-10-30 14:52:21.152949','anonymous','GET','SUBJECTS','Get subjects with pagination',NULL,NULL),(21,'/api/v1/subjects','2025-10-30 14:52:21.157949','anonymous','POST','SUBJECTS','Create a subject',NULL,NULL),(22,'/api/v1/subjects','2025-10-30 14:52:21.162965','anonymous','PUT','SUBJECTS','Update a subject',NULL,NULL),(23,'/api/v1/subjects/{id}','2025-10-30 14:52:21.168956','anonymous','DELETE','SUBJECTS','Delete a subject',NULL,NULL),(24,'/api/v1/subjects/{id}','2025-10-30 14:52:21.174983','anonymous','GET','SUBJECTS','Get a subject by id',NULL,NULL),(25,'/api/v1/subjects','2025-10-30 14:52:21.179658','anonymous','GET','SUBJECTS','Get subjects with pagination',NULL,NULL),(26,'/api/v1/purchases','2025-10-30 14:52:21.186537','anonymous','POST','PURCHASES','Create a purchase',NULL,NULL),(27,'/api/v1/purchases/user/{userId}','2025-10-30 14:52:21.192096','anonymous','GET','PURCHASES','Get a purchase by userId',NULL,NULL),(28,'/api/v1/purchases/{id}','2025-10-30 14:52:21.198210','anonymous','DELETE','PURCHASES','Delete a purchase',NULL,NULL),(29,'/api/v1/purchases/{id}','2025-10-30 14:52:21.203218','anonymous','GET','PURCHASES','Get a purchase by id',NULL,NULL),(30,'/api/v1/purchases/subject/{subjectId}','2025-10-30 14:52:21.210214','anonymous','GET','PURCHASES','Get purchases by subjectId',NULL,NULL),(31,'/api/v1/questions','2025-10-30 14:52:21.216213','anonymous','POST','QUESTIONS','Create a question',NULL,NULL),(32,'/api/v1/questions','2025-10-30 14:52:21.222302','anonymous','PUT','QUESTIONS','Update a question',NULL,NULL),(33,'/api/v1/questions/{id}','2025-10-30 14:52:21.228886','anonymous','DELETE','QUESTIONS','Delete a question',NULL,NULL),(34,'/api/v1/questions/{id}','2025-10-30 14:52:21.233878','anonymous','GET','QUESTIONS','Get a question by id',NULL,NULL),(35,'/api/v1/questions/subject/{subjectId}','2025-10-30 14:52:21.240891','anonymous','GET','QUESTIONS','Get questions by subjectId',NULL,NULL),(36,'/api/v1/chapters','2025-10-30 14:52:21.246559','anonymous','POST','CHAPTERS','Create a chapter',NULL,NULL),(37,'/api/v1/chapters','2025-10-30 14:52:21.253034','anonymous','PUT','CHAPTERS','Update a chapter',NULL,NULL),(38,'/api/v1/chapters/{id}','2025-10-30 14:52:21.258074','anonymous','DELETE','CHAPTERS','Delete a chapter',NULL,NULL),(39,'/api/v1/chapters/{id}','2025-10-30 14:52:21.265578','anonymous','GET','CHAPTERS','Get a chapter by id',NULL,NULL),(40,'/api/v1/chapters/subject/{subjectId}','2025-10-30 14:52:21.272569','anonymous','GET','CHAPTERS','Get chapters by subjectId',NULL,NULL),(41,'/api/v1/files','2025-10-30 14:52:21.279750','anonymous','GET','FILES','Download a file',NULL,NULL),(42,'/api/v1/files','2025-10-30 14:52:21.284753','anonymous','POST','FILES','Upload a file',NULL,NULL),(43,'/api/v1/users/{email}/avatar',NULL,NULL,'POST','USER','upload avatar',NULL,NULL),(44,'/api/v1/comments/{subjectId}','2025-11-01 12:00:01.390216','admin@gmail.com','POST','COMMENTS','create comment',NULL,NULL),(45,'/api/v1/comments/reply/{parentId}','2025-11-01 12:00:44.010791','admin@gmail.com','POST','COMMENTS','reply comment',NULL,NULL),(46,'/api/v1/comments/subject/{subjectId}','2025-11-01 12:01:19.046150','admin@gmail.com','GET','COMMENTS','get by subjectId comment',NULL,NULL),(47,'/api/v1/comments/{commentId}','2025-11-01 12:02:12.155197','admin@gmail.com','DELETE','COMMENTS','delete comment',NULL,NULL),(48,'/api/v1/submissions/start','2025-11-05 03:02:40.687398','admin@gmail.com','POST','SUBMISISONS','start submission',NULL,NULL),(49,'/api/v1/submissions/{submissionId}/submit','2025-11-05 03:03:55.662152','admin@gmail.com','POST','SUBMISISONS','submit submission',NULL,NULL),(50,'/api/v1/questions/subject/{subjectId}/random','2025-11-05 06:14:58.761261','admin@gmail.com','GET','QUESTIONS','get question random',NULL,NULL),(51,'/api/v1/submissions/history/user/{userId}','2025-11-06 05:35:09.582757','admin@gmail.com','GET','SUBMISISONS','get submissions history',NULL,NULL),(52,'/api/v1/submissions/analytics/user/{userId}','2025-11-06 15:55:15.833664','admin@gmail.com','GET','SUBMISISONS','get analytics by userId',NULL,NULL),(53,'/api/v1/payments/vnpay/submitOrder','2025-11-07 09:19:14.510489','admin@gmail.com','POST','PAYMENTS','submit order',NULL,NULL),(54,'/api/v1/payments/vnpay/vnpay-payment','2025-11-07 09:20:17.404069','admin@gmail.com','GET','PAYMENTS','handle payment',NULL,NULL),(55,'/api/v1/subjects/seller/{sellerId}','2025-11-07 16:27:05.300690','admin@gmail.com','GET','SUBJECTS','get subject by seller id',NULL,NULL),(56,'/api/v1/seller/orders/{sellerId}','2025-11-11 07:01:41.752925','admin@gmail.com','GET','SELLERS','get order by seller id','2025-11-22 10:08:20.612002','admin@gmail.com'),(57,'/api/v1/seller/wallet/{sellerId}','2025-11-12 13:16:42.470126','admin@gmail.com','GET','SELLERS','get wallet by seller id','2025-11-22 10:08:27.007181','admin@gmail.com'),(58,'/api/v1/withdraw','2025-11-12 13:28:32.338419','admin@gmail.com','POST','WITHDRAWS','withdraw','2025-11-22 10:08:06.151968','admin@gmail.com'),(59,'/api/v1/users/profile','2025-11-14 05:48:29.119209','admin@gmail.com','PUT','USERS','update user profile',NULL,NULL),(60,'/api/v1/users/change-password','2025-11-14 05:49:01.963939','admin@gmail.com','POST','USERS','update user password',NULL,NULL),(61,'/api/v1/users/preferences','2025-11-14 05:49:27.335729','admin@gmail.com','PUT','USERS','update user preferences',NULL,NULL),(62,'/api/v1/users/me','2025-11-14 05:49:50.808688','admin@gmail.com','GET','USERS','get user proofile',NULL,NULL),(63,'/api/v1/admin/analysis','2025-11-15 03:55:53.960485','admin@gmail.com','GET','ADMINS','get admin analysis','2025-11-22 10:07:11.261472','admin@gmail.com'),(64,'/api/v1/users/changeStatus','2025-11-16 07:00:23.134095','admin@gmail.com','POST','ADMINS','change status user','2025-11-22 10:07:05.796315','admin@gmail.com'),(65,'api/v1/subjects/{subjectId}/approve','2025-11-16 15:03:46.957265','admin@gmail.com','PUT','SUBJECTS','approve subject','2025-11-22 10:06:53.525875','admin@gmail.com'),(66,'api/v1/subjects/{subjectId}/reject','2025-11-16 15:04:24.401523','admin@gmail.com','PUT','SUBJECTS','reject subject','2025-11-22 10:06:46.488554','admin@gmail.com'),(67,'/api/v1/subjects/demo','2025-11-17 15:42:39.491309','admin@gmail.com','GET','SUBJECTS','Get demo subjects','2025-11-22 10:06:36.810003','admin@gmail.com'),(68,'/api/v1/subjects/draft','2025-11-17 17:14:58.300382','admin@gmail.com','POST','SUBJECTS','create draft subject','2025-11-22 10:06:27.842554','admin@gmail.com'),(69,'/api/v1/payments/vnpay/failedPayment','2025-11-18 07:00:57.821664','admin@gmail.com','POST','PAYMENTS','set failed payments','2025-11-22 10:06:16.555435','admin@gmail.com'),(70,'/api/v1/admin/orders','2025-11-18 08:52:46.313693','admin@gmail.com','GET','ADMINS','get order by admin','2025-11-22 10:05:49.771051','admin@gmail.com'),(71,'/api/v1/seller/recentOrder/{subjectId}','2025-11-18 16:47:19.979009','admin@gmail.com','GET','SELLERS','get recent order by order id','2025-11-22 10:06:02.131911','admin@gmail.com'),(72,'/api/v1/comments/user/{userId}','2025-11-19 04:13:55.407563','admin@gmail.com','GET','USERS','get my rating','2025-11-22 10:09:59.016762','admin@gmail.com'),(73,'/api/v1/admin/weekly-quizzes','2025-11-22 10:11:10.878096','admin@gmail.com','POST','WEEKLY_QUIZZES','create weekly quizzes','2025-11-22 13:04:33.286621','admin@gmail.com'),(74,'/api/v1/admin/weekly-quizzes/{id}','2025-11-22 10:12:01.679515','admin@gmail.com','PUT','WEEKLY_QUIZZES','update weekly quizzes by quizId','2025-11-22 13:04:38.893854','admin@gmail.com'),(75,'/api/v1/admin/weekly-quizzes/{id}','2025-11-22 10:54:27.317600','admin@gmail.com','DELETE','WEEKLY_QUIZZES','Delete weekly quiz by quizId',NULL,NULL),(76,'/api/v1/admin/weekly-quizzes','2025-11-22 10:55:07.140221','admin@gmail.com','GET','WEEKLY_QUIZZES','get all weekly quiz',NULL,NULL),(77,'/api/v1/admin/weekly-quizzes/{id}','2025-11-22 10:55:47.321839','admin@gmail.com','GET','WEEKLY_QUIZZES','get weekly quiz detail',NULL,NULL),(78,'/api/v1/weekly-quiz/current','2025-11-22 10:56:15.307208','admin@gmail.com','GET','WEEKLY_QUIZZES','get current weekly quiz',NULL,NULL),(79,'/api/v1/weekly-quiz/{id}/status','2025-11-22 10:56:52.458657','admin@gmail.com','GET','WEEKLY_QUIZZES','get weekly quiz status',NULL,NULL),(80,'/api/v1/weekly-quiz/submit','2025-11-22 10:57:27.831189','admin@gmail.com','POST','WEEKLY_QUIZZES','submit weekly quiz ',NULL,NULL),(81,'/api/v1/rewards/available','2025-11-23 08:20:23.130233','admin@gmail.com','GET','REWARDS','get Available Rewards','2025-11-23 08:55:58.601525','admin@gmail.com'),(82,'/api/v1/rewards/redeem','2025-11-23 08:26:27.718228','admin@gmail.com','POST','REWARDS','redeem Reward',NULL,NULL),(83,'/api/v1/rewards/my-transactions','2025-11-23 08:26:55.983585','admin@gmail.com','GET','REWARDS','get My Transactions',NULL,NULL),(84,'/api/v1/rewards','2025-11-23 08:27:32.971876','admin@gmail.com','POST','REWARDS','create Reward',NULL,NULL),(85,'/api/v1/rewards/{id}','2025-11-23 08:27:56.036619','admin@gmail.com','PUT','REWARDS','update Reward',NULL,NULL),(86,'/api/v1/rewards/{id}','2025-11-23 08:28:48.640825','admin@gmail.com','DELETE','REWARDS','delete Reward',NULL,NULL),(87,'/api/v1/rewards','2025-11-23 08:29:19.260605','admin@gmail.com','GET','REWARDS','get All Rewards',NULL,NULL),(88,'/api/v1/rewards/{id}','2025-11-23 08:29:48.907336','admin@gmail.com','GET','REWARDS','get Reward By Id',NULL,NULL),(89,'/api/v1/rewards/transactions','2025-11-23 08:30:08.642976','admin@gmail.com','GET','REWARDS','get All Transactions',NULL,NULL),(90,'/api/v1/rewards/transactions/{id}/status','2025-11-23 19:44:23.879772','admin@gmail.com','PUT','REWARDS','update Transaction Status',NULL,NULL);
/*!40000 ALTER TABLE `permissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `purchases`
--

DROP TABLE IF EXISTS `purchases`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `purchases` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `purchased_at` datetime(6) DEFAULT NULL,
  `user_id` bigint NOT NULL,
  `subject_id` bigint NOT NULL,
  `seller_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKm0ndjymn9p747pfp4515pio8i` (`user_id`),
  KEY `FKqmv80gko0vo859yk6k5hkq8jb` (`subject_id`),
  KEY `FKkahbc71b6m077rs5g480msflb` (`seller_id`),
  CONSTRAINT `FKkahbc71b6m077rs5g480msflb` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKm0ndjymn9p747pfp4515pio8i` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKqmv80gko0vo859yk6k5hkq8jb` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=16 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `purchases`
--

LOCK TABLES `purchases` WRITE;
/*!40000 ALTER TABLE `purchases` DISABLE KEYS */;
INSERT INTO `purchases` VALUES (1,'2025-11-03 17:57:37.079082',1,1,1),(2,'2025-11-03 18:41:40.351904',2,1,1),(4,'2025-11-03 18:41:47.072166',2,3,2),(6,'2025-11-12 15:00:55.552544',2,13,1),(11,'2025-11-20 07:13:20.016912',2,20,9),(12,'2025-11-20 15:09:53.136376',2,23,9),(13,'2025-11-21 08:11:25.292751',2,6,1),(14,'2025-11-23 05:16:12.131405',7,23,9),(15,'2025-11-23 10:36:44.334021',2,2,1);
/*!40000 ALTER TABLE `purchases` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `question_options`
--

DROP TABLE IF EXISTS `question_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `question_options` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `is_correct` bit(1) DEFAULT NULL,
  `option_order` int DEFAULT NULL,
  `question_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsb9v00wdrgc9qojtjkv7e1gkp` (`question_id`),
  CONSTRAINT `FKsb9v00wdrgc9qojtjkv7e1gkp` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=585 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `question_options`
--

LOCK TABLES `question_options` WRITE;
/*!40000 ALTER TABLE `question_options` DISABLE KEYS */;
INSERT INTO `question_options` VALUES (13,'Là phần mềm ứng dụng',_binary '\0',1,5),(14,'Là phần mềm hệ thống',_binary '',2,5),(15,'Là phần cứng của máy tính',_binary '\0',3,5),(16,'Tăng tốc độ CPU',_binary '\0',1,6),(17,'Quản lý tài nguyên và cung cấp giao diện',_binary '',2,6),(18,'Lưu trữ dữ liệu',_binary '\0',3,6),(19,'Trình duyệt web',_binary '\0',1,7),(20,'Kernel',_binary '',2,7),(21,'Bộ nhớ ROM',_binary '\0',3,7),(22,'Quản lý bộ nhớ',_binary '\0',1,8),(23,'Phân bổ CPU cho tiến trình',_binary '',2,8),(24,'Quản lý ổ đĩa',_binary '\0',3,8),(25,'Một loại tiến trình đặc biệt',_binary '\0',1,9),(26,'Tình huống các tiến trình chờ tài nguyên của nhau',_binary '',2,9),(27,'Phần mềm hệ thống',_binary '\0',3,9),(28,'Lưu trữ file tạm thời',_binary '\0',1,10),(29,'Chạy chương trình lớn hơn RAM',_binary '',2,10),(30,'Tăng tốc CPU',_binary '\0',3,10),(31,'Lưu trạng thái CPU khi chuyển tiến trình',_binary '',1,11),(32,'Thay đổi ngôn ngữ giao diện',_binary '\0',2,11),(33,'Khởi động lại CPU',_binary '\0',3,11),(34,'Một tiến trình chạy duy nhất',_binary '\0',1,12),(35,'Nhiều tiến trình chạy đồng thời',_binary '',2,12),(36,'Chạy tiến trình theo thứ tự cố định',_binary '\0',3,12),(37,'Quản lý CPU',_binary '\0',1,13),(38,'Quản lý tệp tin và lưu trữ',_binary '',2,13),(39,'Phân phối RAM',_binary '\0',3,13),(40,'Lời gọi hàm trong phần mềm ứng dụng',_binary '\0',1,14),(41,'Cơ chế giao tiếp giữa user mode và kernel mode',_binary '',2,14),(42,'Một loại tiến trình đặc biệt',_binary '\0',3,14),(43,'Là ngôn ngữ lập trình',_binary '\0',1,15),(44,'Là cách tổ chức dữ liệu',_binary '',2,15),(45,'Là phần cứng máy tính',_binary '\0',3,15),(46,'FIFO',_binary '\0',1,16),(47,'LIFO',_binary '',2,16),(48,'Random Access',_binary '\0',3,16),(49,'LIFO',_binary '\0',1,17),(50,'FIFO',_binary '',2,17),(51,'LILO',_binary '\0',3,17),(52,'Queue',_binary '\0',1,18),(53,'Stack',_binary '',2,18),(54,'Array',_binary '\0',3,18),(55,'Linked List',_binary '\0',1,19),(56,'Binary Tree',_binary '',2,19),(57,'Queue',_binary '\0',3,19),(58,'O(1)',_binary '\0',1,20),(59,'O(n)',_binary '',2,20),(60,'O(log n)',_binary '\0',3,20),(61,'Truy cập ngẫu nhiên nhanh hơn',_binary '\0',1,21),(62,'Chèn/xóa linh hoạt hơn',_binary '',2,21),(63,'Tiêu tốn ít bộ nhớ hơn',_binary '\0',3,21),(64,'O(n)',_binary '\0',1,22),(65,'O(log n)',_binary '',2,22),(66,'O(n^2)',_binary '\0',3,22),(67,'Lưu dữ liệu tuần tự',_binary '\0',1,23),(68,'Truy cập dữ liệu bằng khóa',_binary '',2,23),(69,'Sắp xếp dữ liệu',_binary '\0',3,23),(70,'Bubble Sort',_binary '\0',1,24),(71,'Quick Sort',_binary '',2,24),(72,'Insertion Sort',_binary '\0',3,24),(73,'Một hệ điều hành',_binary '\0',1,25),(74,'Tập hợp các máy tính kết nối với nhau',_binary '',2,25),(75,'Một phần mềm văn phòng',_binary '\0',3,25),(76,'Hub',_binary '\0',1,26),(77,'Router',_binary '',2,26),(78,'Switch',_binary '\0',3,26),(79,'3 tầng',_binary '\0',1,27),(80,'4 tầng',_binary '',2,27),(81,'7 tầng',_binary '\0',3,27),(82,'Tầng Application',_binary '\0',1,28),(83,'Tầng Network',_binary '',2,28),(84,'Tầng Presentation',_binary '\0',3,28),(85,'Tầng Transport',_binary '\0',1,29),(86,'Tầng Application',_binary '',2,29),(87,'Tầng Network',_binary '\0',3,29),(88,'Tên miền của website',_binary '\0',1,30),(89,'Định danh duy nhất cho mỗi thiết bị trong mạng',_binary '',2,30),(90,'Địa chỉ email',_binary '\0',3,30),(91,'FTP',_binary '\0',1,31),(92,'SMTP',_binary '',2,31),(93,'HTTP',_binary '\0',3,31),(94,'25',_binary '\0',1,32),(95,'80',_binary '',2,32),(96,'443',_binary '\0',3,32),(97,'Router',_binary '\0',1,33),(98,'Switch',_binary '',2,33),(99,'Hub',_binary '\0',3,33),(100,'SMTP',_binary '\0',1,34),(101,'FTP',_binary '',2,34),(102,'DNS',_binary '\0',3,34),(155,'1',_binary '\0',1,47),(156,'2',_binary '',2,47),(157,'3',_binary '\0',3,47),(158,'4',_binary '\0',4,47),(159,'2',_binary '',1,48),(160,'3',_binary '\0',2,48),(161,'4',_binary '\0',3,48),(162,'6',_binary '\0',4,48),(163,'5',_binary '\0',5,48),(417,'1',_binary '\0',1,49),(418,'2',_binary '\0',2,49),(419,'3',_binary '\0',3,49),(420,'4',_binary '',4,49),(541,'1',_binary '',NULL,141),(542,'2',_binary '\0',NULL,141),(543,'3',_binary '\0',NULL,141),(544,'4',_binary '\0',NULL,141),(545,'`1',_binary '\0',NULL,142),(546,'2',_binary '',NULL,142),(547,'3',_binary '\0',NULL,142),(548,'4',_binary '\0',NULL,142),(549,'1',_binary '\0',NULL,143),(550,'2',_binary '\0',NULL,143),(551,'3',_binary '',NULL,143),(552,'4',_binary '\0',NULL,143),(553,'1',_binary '\0',NULL,144),(554,'2',_binary '\0',NULL,144),(555,'3',_binary '\0',NULL,144),(556,'4',_binary '',NULL,144),(557,'3',_binary '\0',NULL,145),(558,'4',_binary '\0',NULL,145),(559,'5',_binary '',NULL,145),(560,'6',_binary '\0',NULL,145),(561,'4',_binary '\0',NULL,146),(562,'5',_binary '\0',NULL,146),(563,'6',_binary '',NULL,146),(564,'7',_binary '\0',NULL,146),(565,'6',_binary '\0',NULL,147),(566,'7',_binary '',NULL,147),(567,'8',_binary '\0',NULL,147),(568,'9',_binary '\0',NULL,147),(569,'7',_binary '\0',NULL,148),(570,'8',_binary '',NULL,148),(571,'9',_binary '\0',NULL,148),(572,'10',_binary '\0',NULL,148),(573,'7',_binary '\0',NULL,149),(574,'8',_binary '\0',NULL,149),(575,'9',_binary '',NULL,149),(576,'10',_binary '\0',NULL,149),(577,'10',_binary '',NULL,150),(578,'8',_binary '\0',NULL,150),(579,'9',_binary '\0',NULL,150),(580,'0',_binary '\0',NULL,150),(581,'4',_binary '\0',1,50),(582,'5',_binary '\0',2,50),(583,'6',_binary '',3,50),(584,'7',_binary '\0',4,50);
/*!40000 ALTER TABLE `question_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `questions`
--

DROP TABLE IF EXISTS `questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `content` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `explanation` mediumtext,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `chapter_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `correctness_percentage` double DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `type` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKd1wulherkir0s9abbqr195fr4` (`chapter_id`),
  KEY `FKo0h0rn8bxifrxmq1d8ipiyqv5` (`subject_id`),
  CONSTRAINT `FKd1wulherkir0s9abbqr195fr4` FOREIGN KEY (`chapter_id`) REFERENCES `chapters` (`id`),
  CONSTRAINT `FKo0h0rn8bxifrxmq1d8ipiyqv5` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=151 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `questions`
--

LOCK TABLES `questions` WRITE;
/*!40000 ALTER TABLE `questions` DISABLE KEYS */;
INSERT INTO `questions` VALUES (5,'Hệ điều hành là gì?','2025-11-01 07:12:47.183964','admin@gmail.com','Hệ điều hành là phần mềm quản lý tài nguyên phần cứng và phần mềm.','2025-11-24 06:58:39.617054','user@gmail.com',2,1,66.66666666666666,NULL,NULL),(6,'Mục đích chính của hệ điều hành là gì?','2025-11-01 07:12:47.317027','admin@gmail.com','Hệ điều hành giúp quản lý tài nguyên máy tính và cung cấp môi trường cho người dùng.','2025-11-24 06:58:39.629115','user@gmail.com',2,1,16.666666666666664,NULL,NULL),(7,'Thành phần nào dưới đây thuộc hệ điều hành?','2025-11-01 07:12:47.333173','admin@gmail.com','Kernel là phần lõi của hệ điều hành, quản lý tài nguyên phần cứng.','2025-11-24 06:58:39.642483','user@gmail.com',2,1,33.33333333333333,NULL,NULL),(8,'CPU Scheduling trong hệ điều hành có mục đích gì?','2025-11-01 07:12:47.349151','admin@gmail.com','CPU Scheduling quyết định tiến trình nào được thực thi tiếp theo.','2025-11-24 06:58:39.653188','user@gmail.com',2,1,33.33333333333333,NULL,NULL),(9,'Deadlock là gì?','2025-11-01 07:12:47.362607','admin@gmail.com','Deadlock xảy ra khi các tiến trình chờ nhau mãi mãi mà không thể tiếp tục.','2025-11-24 06:58:39.663709','user@gmail.com',2,1,33.33333333333333,NULL,NULL),(10,'Bộ nhớ ảo (Virtual Memory) cho phép điều gì?','2025-11-01 07:12:47.378703','admin@gmail.com','Bộ nhớ ảo cho phép chạy chương trình lớn hơn dung lượng RAM thực tế.','2025-11-24 06:58:39.674228','user@gmail.com',2,1,33.33333333333333,NULL,NULL),(11,'Cơ chế chuyển ngữ cảnh (context switch) là gì?','2025-11-01 07:12:47.393768','admin@gmail.com','Là quá trình lưu và khôi phục trạng thái của tiến trình khi chuyển CPU giữa các tiến trình.','2025-11-24 06:58:39.683753','user@gmail.com',2,1,16.666666666666664,NULL,NULL),(12,'Hệ điều hành đa nhiệm (multitasking) là gì?','2025-11-01 07:12:47.409121','admin@gmail.com','Cho phép nhiều tiến trình chạy xen kẽ nhau trên cùng CPU.','2025-11-24 06:58:39.692270','user@gmail.com',2,1,33.33333333333333,NULL,NULL),(13,'File System của hệ điều hành dùng để làm gì?','2025-11-01 07:12:47.426156','admin@gmail.com','File System giúp tổ chức, lưu trữ và truy cập dữ liệu trên ổ đĩa.','2025-11-24 06:58:39.703676','user@gmail.com',2,1,33.33333333333333,NULL,NULL),(14,'System Call trong hệ điều hành là gì?','2025-11-01 07:12:47.441282','admin@gmail.com','System Call là cầu nối giữa chương trình người dùng và nhân hệ điều hành.','2025-11-24 06:58:39.725066','user@gmail.com',2,1,16.666666666666664,NULL,NULL),(15,'Cấu trúc dữ liệu là gì?','2025-11-01 07:14:47.549663','admin@gmail.com','Cấu trúc dữ liệu là cách tổ chức và lưu trữ dữ liệu để có thể truy cập và xử lý hiệu quả.','2025-11-23 10:37:41.863429','user@gmail.com',NULL,2,0,NULL,NULL),(16,'Stack hoạt động theo nguyên tắc nào?','2025-11-01 07:14:47.561442','admin@gmail.com','Stack hoạt động theo nguyên tắc LIFO (Last In, First Out).','2025-11-23 10:37:41.790695','user@gmail.com',NULL,2,0,NULL,NULL),(17,'Hàng đợi (Queue) hoạt động theo nguyên tắc nào?','2025-11-01 07:14:47.576558','admin@gmail.com','Queue hoạt động theo nguyên tắc FIFO (First In, First Out).','2025-11-23 10:37:41.799688','user@gmail.com',NULL,2,0,NULL,NULL),(18,'Cấu trúc dữ liệu nào được dùng để thực hiện đệ quy?','2025-11-01 07:14:47.589620','admin@gmail.com','Stack được dùng để lưu trữ trạng thái của hàm trong đệ quy.','2025-11-06 16:02:59.749103','user@gmail.com',NULL,2,0,NULL,NULL),(19,'Cấu trúc dữ liệu nào phù hợp để duyệt theo thứ tự (order traversal)?','2025-11-01 07:14:47.601849','admin@gmail.com','Cây nhị phân (Binary Tree) được dùng để duyệt theo thứ tự inorder, preorder, postorder.','2025-11-23 10:37:41.814016','user@gmail.com',NULL,2,0,NULL,NULL),(20,'Độ phức tạp tìm kiếm trong mảng chưa sắp xếp là gì?','2025-11-01 07:14:47.614380','admin@gmail.com','Trong mảng chưa sắp xếp, ta phải duyệt hết mảng → O(n).','2025-11-23 10:37:41.821917','user@gmail.com',NULL,2,0,NULL,NULL),(21,'Danh sách liên kết (Linked List) có ưu điểm gì so với mảng?','2025-11-01 07:14:47.628447','admin@gmail.com','Linked List có thể chèn/xóa phần tử dễ dàng mà không cần dời phần tử khác.','2025-11-23 10:37:41.828916','user@gmail.com',NULL,2,0,NULL,NULL),(22,'Độ phức tạp tìm kiếm trong cây nhị phân tìm kiếm cân bằng là bao nhiêu?','2025-11-01 07:14:47.638061','admin@gmail.com','Trong cây nhị phân tìm kiếm cân bằng, tìm kiếm mất O(log n).','2025-11-23 10:37:41.835423','user@gmail.com',NULL,2,0,NULL,NULL),(23,'Hash Table dùng để làm gì?','2025-11-01 07:14:47.651007','admin@gmail.com','Hash Table cho phép truy cập phần tử nhanh dựa vào khóa (key).','2025-11-23 10:37:41.841437','user@gmail.com',NULL,2,0,NULL,NULL),(24,'Thuật toán sắp xếp nào có độ phức tạp trung bình là O(n log n)?','2025-11-01 07:14:47.666076','admin@gmail.com','Merge Sort và Quick Sort có độ phức tạp trung bình O(n log n).','2025-11-23 10:37:41.847453','user@gmail.com',NULL,2,0,NULL,NULL),(25,'Mạng máy tính là gì?','2025-11-01 07:15:23.365593','admin@gmail.com','Mạng máy tính là tập hợp các máy tính được kết nối với nhau để chia sẻ tài nguyên và thông tin.',NULL,NULL,NULL,3,NULL,NULL,NULL),(26,'Thiết bị nào dùng để kết nối nhiều mạng lại với nhau?','2025-11-01 07:15:23.384241','admin@gmail.com','Router dùng để kết nối nhiều mạng khác nhau.',NULL,NULL,NULL,3,NULL,NULL,NULL),(27,'Giao thức TCP/IP hoạt động ở bao nhiêu tầng?','2025-11-01 07:15:23.398952','admin@gmail.com','Mô hình TCP/IP gồm 4 tầng: Application, Transport, Internet, Network Access.',NULL,NULL,NULL,3,NULL,NULL,NULL),(28,'Tầng nào trong mô hình OSI chịu trách nhiệm truyền dữ liệu giữa các máy tính?','2025-11-01 07:15:23.414210','admin@gmail.com','Tầng Network chịu trách nhiệm định tuyến và truyền dữ liệu qua mạng.',NULL,NULL,NULL,3,NULL,NULL,NULL),(29,'Giao thức HTTP hoạt động ở tầng nào của mô hình OSI?','2025-11-01 07:15:23.428026','admin@gmail.com','HTTP hoạt động ở tầng Application, nơi giao tiếp với người dùng cuối.',NULL,NULL,NULL,3,NULL,NULL,NULL),(30,'Địa chỉ IP là gì?','2025-11-01 07:15:23.442353','admin@gmail.com','Địa chỉ IP là số nhận dạng duy nhất cho mỗi thiết bị trong mạng.',NULL,NULL,NULL,3,NULL,NULL,NULL),(31,'Giao thức nào dùng để truyền email?','2025-11-01 07:15:23.454491','admin@gmail.com','SMTP (Simple Mail Transfer Protocol) được dùng để gửi email.',NULL,NULL,NULL,3,NULL,NULL,NULL),(32,'Cổng mặc định của giao thức HTTP là bao nhiêu?','2025-11-01 07:15:23.466809','admin@gmail.com','HTTP mặc định dùng cổng 80, HTTPS dùng cổng 443.',NULL,NULL,NULL,3,NULL,NULL,NULL),(33,'Thiết bị nào hoạt động ở tầng 2 của mô hình OSI?','2025-11-01 07:15:23.478841','admin@gmail.com','Switch hoạt động ở tầng Data Link (tầng 2).',NULL,NULL,NULL,3,NULL,NULL,NULL),(34,'Giao thức nào dùng để truyền tệp tin qua mạng?','2025-11-01 07:15:23.490981','admin@gmail.com','FTP (File Transfer Protocol) dùng để truyền tệp tin giữa các máy tính.',NULL,NULL,NULL,3,NULL,NULL,NULL),(47,'1 + 1','2025-11-20 07:12:13.772099','trannguyennhuttruong@gmail.com','','2025-11-20 07:13:34.731555','user@gmail.com',NULL,20,100,NULL,NULL),(48,'1 + 1 =','2025-11-20 14:47:16.003175','trannguyennhuttruong@gmail.com','1 + 1 = 2','2025-11-22 16:53:09.800268','user@gmail.com',NULL,23,81.81818181818183,'1763650035993-Cosodulieu.jpg','ONE_CHOICE'),(49,'2 + 2 = ','2025-11-20 14:47:16.026747','trannguyennhuttruong@gmail.com','','2025-11-22 16:53:09.806309','user@gmail.com',NULL,23,100,NULL,'ONE_CHOICE'),(50,'3 + 3 = ','2025-11-20 14:47:16.044583','trannguyennhuttruong@gmail.com','','2025-11-23 05:17:56.295853','trannguyennhuttruong@gmail.com',NULL,23,100,'1763875076261-CayChuoiNonDiGiayXanh.jpg','ONE_CHOICE'),(141,'1','2025-11-22 17:11:11.975526','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(142,'2','2025-11-22 17:11:11.986837','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(143,'3','2025-11-22 17:11:11.996476','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(144,'4','2025-11-22 17:11:12.008027','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(145,'5','2025-11-22 17:11:12.020805','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(146,'6','2025-11-22 17:11:12.031712','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(147,'7','2025-11-22 17:11:12.040741','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(148,'8','2025-11-22 17:11:12.050526','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(149,'9','2025-11-22 17:11:12.058870','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE'),(150,'10','2025-11-22 17:11:12.070393','admin@gmail.com',NULL,NULL,NULL,NULL,NULL,0,NULL,'ONE_CHOICE');
/*!40000 ALTER TABLE `questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reward_transactions`
--

DROP TABLE IF EXISTS `reward_transactions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reward_transactions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `coins_cost` int NOT NULL,
  `delivery_info` text,
  `redeemed_at` datetime(6) DEFAULT NULL,
  `status` enum('CANCELLED','COMPLETED','PENDING') DEFAULT NULL,
  `reward_id` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKf5dq9d85kkjxvnhkomou84kqd` (`reward_id`),
  KEY `FK2qgkqf0r6hmvgqq40t8daay6d` (`user_id`),
  CONSTRAINT `FK2qgkqf0r6hmvgqq40t8daay6d` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKf5dq9d85kkjxvnhkomou84kqd` FOREIGN KEY (`reward_id`) REFERENCES `rewards` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reward_transactions`
--

LOCK TABLES `reward_transactions` WRITE;
/*!40000 ALTER TABLE `reward_transactions` DISABLE KEYS */;
INSERT INTO `reward_transactions` VALUES (6,10,'Name: Tui Ten Truong, Phone: 0795432149, Address: 3/2 NK CT','2025-11-23 19:13:14.882603','COMPLETED',1,2);
/*!40000 ALTER TABLE `reward_transactions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `rewards`
--

DROP TABLE IF EXISTS `rewards`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `rewards` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `cost` int NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `description` text,
  `image_url` varchar(255) DEFAULT NULL,
  `in_stock` bit(1) NOT NULL,
  `is_active` bit(1) NOT NULL,
  `name` varchar(255) NOT NULL,
  `stock_quantity` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `rewards`
--

LOCK TABLES `rewards` WRITE;
/*!40000 ALTER TABLE `rewards` DISABLE KEYS */;
INSERT INTO `rewards` VALUES (1,10,'2025-11-23 08:43:16.724633','admin@gmail.com','áo thun đẹpp','1763887396713-aothun.jpg',_binary '',_binary '','áo thun',1,'2025-11-23 19:13:14.889672','user@gmail.com');
/*!40000 ALTER TABLE `rewards` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `roles`
--

DROP TABLE IF EXISTS `roles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `roles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `active` bit(1) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=9 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `roles`
--

LOCK TABLES `roles` WRITE;
/*!40000 ALTER TABLE `roles` DISABLE KEYS */;
INSERT INTO `roles` VALUES (1,_binary '','2025-10-30 14:52:21.626475','anonymous','Admin thì full permission','SUPER_ADMIN','2025-11-23 19:44:33.261891','admin@gmail.com'),(2,_binary '','2025-10-30 14:52:22.076880','anonymous','Default regular user with read permissions','STUDENT','2025-11-23 08:31:14.343330','admin@gmail.com'),(4,_binary '','2025-11-18 04:09:53.831212','admin@gmail.com','đây là vai trò dành cho người bán trắc nghiệm\n','SELLER','2025-11-18 16:47:28.177534','admin@gmail.com');
/*!40000 ALTER TABLE `roles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `seller_profiles`
--

DROP TABLE IF EXISTS `seller_profiles`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `seller_profiles` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `available_balance` bigint DEFAULT NULL,
  `bank_account` varchar(255) DEFAULT NULL,
  `bank_name` varchar(255) DEFAULT NULL,
  `pending_balance` bigint DEFAULT NULL,
  `total_revenue` bigint DEFAULT NULL,
  `user_id` bigint DEFAULT NULL,
  `seller_id` bigint DEFAULT NULL,
  `pending_withdraw` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK2264dwvu9q06u7388998fl3he` (`user_id`),
  UNIQUE KEY `UKbokutv4nni548tb2ddd1it82h` (`seller_id`),
  CONSTRAINT `FKcpr5ibp9058g7a9u58wh7xf2y` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FKnbbk29o6dqpynhnadnkq0rku` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `seller_profiles`
--

LOCK TABLES `seller_profiles` WRITE;
/*!40000 ALTER TABLE `seller_profiles` DISABLE KEYS */;
INSERT INTO `seller_profiles` VALUES (2,70096,NULL,NULL,212500,3342500,1,1,560004),(3,199999,'12345678','BIDV',68000,268000,NULL,9,1);
/*!40000 ALTER TABLE `seller_profiles` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `subjects`
--

DROP TABLE IF EXISTS `subjects`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `subjects` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `description` mediumtext,
  `name` varchar(255) NOT NULL,
  `price` double NOT NULL,
  `status` enum('DRAFT','PENDING','INACTIVE','ACTIVE','REJECTED','DELETED') DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `seller_id` bigint DEFAULT NULL,
  `image_url` varchar(255) DEFAULT NULL,
  `average_rating` double DEFAULT NULL,
  `rating_count` int DEFAULT NULL,
  `purchase_count` int DEFAULT NULL,
  `highest_score` double DEFAULT NULL,
  `deleted_at` datetime(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKliaxouht015mgqqyb1av6yxp3` (`seller_id`),
  CONSTRAINT `FKliaxouht015mgqqyb1av6yxp3` FOREIGN KEY (`seller_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `subjects`
--

LOCK TABLES `subjects` WRITE;
/*!40000 ALTER TABLE `subjects` DISABLE KEYS */;
INSERT INTO `subjects` VALUES (1,'2025-10-04 05:36:09.962092','Học cách hệ điều hành quản lý tài nguyên, điều phối tiến trình, bộ nhớ, và tệp; nắm vững các cơ chế đồng bộ, lập lịch và xử lý deadlock.','Nguyên lí hệ điều hành',70000,'ACTIVE','2025-11-20 12:15:12.706263',1,'1763373681532-1761919794720-hinh-nen-laptop-anime-min.jpg',4.5,10,21,9,NULL),(2,'2025-10-02 10:20:12.000000','Toán rời rạc cho tin học: tập hợp, đồ thị, logic, thuật toán.','Toán rời rạc',120000,'ACTIVE','2025-11-23 10:37:41.863429',1,'1762530902309-ToanRoiRac.jpg',5,9,202,0,NULL),(3,'2025-10-03 11:05:30.000000','SQL, thiết kế CSDL, quan hệ, chuẩn hóa, truy vấn nâng cao.','Cơ sở dữ liệu (SQL)',180000,'ACTIVE','2025-11-21 08:09:20.336342',2,'Cosodulieu.jpg',5,6,21,88,NULL),(4,'2025-10-04 14:45:00.000000','Javascript hiện đại: ES6, async, DOM, fetch, ES modules.','Javascript hiện đại',200000,'PENDING','2025-10-04 14:45:00.000000',2,NULL,4.5,7,39,67.8,NULL),(6,'2025-10-06 16:00:00.000000','Kiến trúc máy tính: số học nhị phân, tập lệnh, bộ nhớ.','Kiến trúc máy tính',130000,'ACTIVE','2025-11-21 08:11:25.286754',1,NULL,5,5,56,NULL,NULL),(7,'2025-10-07 12:10:05.000000','Mạng máy tính: mô hình OSI, TCP/IP, routing, bảo mật cơ bản.','Mạng máy tính',140000,'ACTIVE','2025-10-07 12:10:05.000000',2,NULL,4,30,60,NULL,NULL),(10,'2025-10-10 18:22:11.000000','Nhập môn AI & ML: học máy cơ bản, supervised/unsupervised, tensorflow.','Nhập môn Trí tuệ nhân tạo',270000,'INACTIVE','2025-11-17 15:02:30.859596',1,NULL,5,5,NULL,NULL,NULL),(11,'2025-10-31 14:09:54.757704','Khóa học cho người mới bắt đầu','Lập trình Java cơ bản',500000,'PENDING','2025-11-12 14:56:46.681721',1,'javacoban.jpg',0,0,2,NULL,NULL),(12,'2025-11-07 15:55:02.335375','Khóa học cho người mới bắt đầu','Lập trình Java cơ bản',500000,'PENDING','2025-11-07 15:55:02.384718',1,'1762530902309-ToanRoiRac.jpg',0,0,0,0,NULL),(13,'2025-11-07 16:13:52.309251','đây là môn toán','Toán',20000,'INACTIVE','2025-11-21 08:09:09.499672',1,'1762532032288-ToanRoiRac.jpg',5,1,3,0,NULL),(20,'2025-11-20 07:12:13.739507','toán','Toán',20000,'DELETED','2025-11-20 07:21:18.591601',9,NULL,0,0,1,10,NULL),(21,'2025-11-20 14:32:14.708198','đây là môn tón','Toán',10000,'DELETED','2025-11-20 14:39:56.706259',9,NULL,0,0,0,0,NULL),(22,'2025-11-20 14:46:08.573871','siu cấp hơn cả toán cao cấp','Toán siu cấp',20000,'DELETED','2025-11-20 14:47:46.475306',9,'1763649968553-Cosodulieu.jpg',0,0,0,0,NULL),(23,'2025-11-20 14:47:15.889986','siu cấp hơn cả toán cao cấp','Toán siu cấp',20000,'ACTIVE','2025-11-23 05:16:34.637968',9,'1763650035881-Cosodulieu.jpg',5,2,2,10,NULL),(24,'2025-11-22 03:34:45.784858','ngữ anh văn','Văn',1000,'PENDING','2025-11-22 03:36:22.487512',9,NULL,0,0,0,0,NULL);
/*!40000 ALTER TABLE `subjects` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_answer_options`
--

DROP TABLE IF EXISTS `submission_answer_options`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_answer_options` (
  `submission_answer_id` bigint NOT NULL,
  `option_id` bigint NOT NULL,
  KEY `FK95pvobho1iqqc225ott1643qu` (`option_id`),
  KEY `FKluxeb1si4kjeq1o9borfg2nku` (`submission_answer_id`),
  CONSTRAINT `FK95pvobho1iqqc225ott1643qu` FOREIGN KEY (`option_id`) REFERENCES `question_options` (`id`),
  CONSTRAINT `FKluxeb1si4kjeq1o9borfg2nku` FOREIGN KEY (`submission_answer_id`) REFERENCES `submission_answers` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_answer_options`
--

LOCK TABLES `submission_answer_options` WRITE;
/*!40000 ALTER TABLE `submission_answer_options` DISABLE KEYS */;
INSERT INTO `submission_answer_options` VALUES (253,159),(256,159),(259,159),(263,163),(266,159),(269,159),(272,160),(274,159),(278,159),(281,159),(282,420),(293,38),(294,14);
/*!40000 ALTER TABLE `submission_answer_options` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submission_answers`
--

DROP TABLE IF EXISTS `submission_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submission_answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_correct` bit(1) DEFAULT NULL,
  `question_id` bigint NOT NULL,
  `selected_option_id` bigint DEFAULT NULL,
  `submission_id` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpg32hvp6c63su96godvcqvsg4` (`question_id`),
  KEY `FK8ns2dt1ongg4l98dm6u63ufhc` (`selected_option_id`),
  KEY `FKfonvi80ii6j4mnvfs1g7m2elb` (`submission_id`),
  CONSTRAINT `FK8ns2dt1ongg4l98dm6u63ufhc` FOREIGN KEY (`selected_option_id`) REFERENCES `question_options` (`id`),
  CONSTRAINT `FKfonvi80ii6j4mnvfs1g7m2elb` FOREIGN KEY (`submission_id`) REFERENCES `submissions` (`id`),
  CONSTRAINT `FKpg32hvp6c63su96godvcqvsg4` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=303 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submission_answers`
--

LOCK TABLES `submission_answers` WRITE;
/*!40000 ALTER TABLE `submission_answers` DISABLE KEYS */;
INSERT INTO `submission_answers` VALUES (189,_binary '',8,23,46),(190,_binary '',11,31,46),(191,_binary '',5,14,46),(192,_binary '',13,38,46),(193,_binary '',7,20,46),(194,_binary '\0',6,16,46),(195,_binary '',14,41,46),(196,_binary '',10,29,46),(197,_binary '',12,35,46),(198,_binary '',9,26,46),(210,_binary '',47,156,52),(211,_binary '\0',11,NULL,54),(212,_binary '\0',9,NULL,54),(213,_binary '\0',7,NULL,54),(214,_binary '\0',10,NULL,54),(215,_binary '\0',14,NULL,54),(216,_binary '\0',12,NULL,54),(217,_binary '\0',13,NULL,54),(218,_binary '\0',8,NULL,54),(219,_binary '\0',6,NULL,54),(220,_binary '\0',5,NULL,54),(221,_binary '\0',6,NULL,55),(222,_binary '\0',11,NULL,55),(223,_binary '\0',9,NULL,55),(224,_binary '\0',14,NULL,55),(225,_binary '\0',5,NULL,55),(226,_binary '\0',10,NULL,55),(227,_binary '\0',13,NULL,55),(228,_binary '\0',7,NULL,55),(229,_binary '\0',8,NULL,55),(230,_binary '\0',12,NULL,55),(231,_binary '',5,14,56),(232,_binary '',10,29,56),(233,_binary '\0',8,22,56),(234,_binary '\0',9,27,56),(235,_binary '',12,35,56),(236,_binary '\0',14,40,56),(237,_binary '',6,17,56),(238,_binary '\0',11,32,56),(239,_binary '\0',7,21,56),(240,_binary '\0',13,37,56),(241,_binary '',8,23,57),(242,_binary '',9,26,57),(243,_binary '\0',6,18,57),(244,_binary '',5,14,57),(245,_binary '\0',11,32,57),(246,_binary '',7,20,57),(247,_binary '\0',14,42,57),(248,_binary '\0',12,36,57),(249,_binary '\0',13,37,57),(250,_binary '\0',10,30,57),(251,_binary '',48,159,58),(253,_binary '',48,159,64),(256,_binary '',48,159,65),(259,_binary '',48,159,67),(263,_binary '\0',48,163,68),(266,_binary '',48,159,69),(269,_binary '',48,159,70),(272,_binary '\0',48,160,71),(274,_binary '',48,159,72),(278,_binary '',48,159,73),(281,_binary '',48,159,74),(282,_binary '',49,420,74),(283,_binary '\0',20,NULL,75),(284,_binary '\0',15,NULL,75),(285,_binary '\0',16,NULL,75),(286,_binary '\0',21,NULL,75),(287,_binary '\0',18,NULL,75),(288,_binary '\0',17,NULL,75),(289,_binary '\0',23,NULL,75),(290,_binary '\0',19,NULL,75),(291,_binary '\0',22,NULL,75),(292,_binary '\0',24,NULL,75),(293,_binary '',13,38,77),(294,_binary '',5,14,77),(295,_binary '\0',11,NULL,77),(296,_binary '\0',9,NULL,77),(297,_binary '\0',8,NULL,77),(298,_binary '\0',14,NULL,77),(299,_binary '\0',12,NULL,77),(300,_binary '\0',6,NULL,77),(301,_binary '\0',10,NULL,77),(302,_binary '\0',7,NULL,77);
/*!40000 ALTER TABLE `submission_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `submissions`
--

DROP TABLE IF EXISTS `submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `correct_count` int DEFAULT NULL,
  `is_practice` bit(1) DEFAULT NULL,
  `score` double DEFAULT NULL,
  `started_at` datetime(6) DEFAULT NULL,
  `status` enum('IN_PROGRESS','SUBMITTED') DEFAULT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `total_questions` int DEFAULT NULL,
  `student_id` bigint DEFAULT NULL,
  `subject_id` bigint DEFAULT NULL,
  `duration` bigint DEFAULT NULL,
  `time_spent` bigint DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3p6y8mnhpwusdgqrdl4hcl72m` (`student_id`),
  KEY `FK9k2iysmllfy2kx1taiwr3c91i` (`subject_id`),
  CONSTRAINT `FK3p6y8mnhpwusdgqrdl4hcl72m` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`),
  CONSTRAINT `FK9k2iysmllfy2kx1taiwr3c91i` FOREIGN KEY (`subject_id`) REFERENCES `subjects` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=78 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `submissions`
--

LOCK TABLES `submissions` WRITE;
/*!40000 ALTER TABLE `submissions` DISABLE KEYS */;
INSERT INTO `submissions` VALUES (46,9,NULL,9,'2025-11-08 10:26:15.156831','SUBMITTED','2025-11-08 10:27:30.169961',10,2,1,5,75),(47,0,NULL,0,'2025-11-08 10:27:50.900113','SUBMITTED','2025-11-20 12:02:06.422256',0,2,3,50,1042456),(48,0,NULL,0,'2025-11-16 09:12:03.776786','IN_PROGRESS',NULL,0,2,1,NULL,NULL),(49,0,NULL,0,'2025-11-16 09:17:26.531671','SUBMITTED','2025-11-20 12:02:06.422256',0,2,1,10,355480),(52,1,NULL,10,'2025-11-20 07:13:29.999495','SUBMITTED','2025-11-20 07:13:34.697304',1,2,20,10,5),(53,0,NULL,0,'2025-11-20 11:54:36.782746','SUBMITTED','2025-11-20 12:06:14.230197',0,2,1,10,698),(54,0,NULL,0,'2025-11-20 12:14:13.457065','SUBMITTED','2025-11-20 12:15:12.571480',10,2,1,1,59),(55,0,NULL,0,'2025-11-20 12:20:55.259019','SUBMITTED','2025-11-20 12:21:54.381607',10,2,1,1,59),(56,4,NULL,4,'2025-11-20 13:02:57.729947','SUBMITTED','2025-11-20 13:03:26.743721',10,2,1,10,29),(57,4,NULL,4,'2025-11-20 13:06:31.896434','SUBMITTED','2025-11-20 13:07:30.934751',10,2,1,1,59),(58,1,NULL,5,'2025-11-20 15:10:14.579111','SUBMITTED','2025-11-20 15:10:49.184339',2,2,23,NULL,35),(59,0,NULL,0,'2025-11-20 15:10:55.449147','IN_PROGRESS',NULL,0,2,23,NULL,NULL),(60,0,NULL,0,'2025-11-20 15:59:27.020766','IN_PROGRESS',NULL,0,2,23,NULL,NULL),(61,0,NULL,0,'2025-11-20 16:06:48.205541','IN_PROGRESS',NULL,0,2,23,NULL,NULL),(62,0,NULL,0,'2025-11-20 16:07:00.803811','IN_PROGRESS',NULL,0,2,23,NULL,NULL),(63,0,NULL,0,'2025-11-21 04:51:20.723824','SUBMITTED','2025-11-21 07:06:06.048679',0,2,23,10,8086),(64,3,NULL,10,'2025-11-21 04:51:33.094319','SUBMITTED','2025-11-21 04:51:44.934111',3,2,23,NULL,11),(65,2,NULL,6.67,'2025-11-21 04:52:03.786124','SUBMITTED','2025-11-21 04:52:16.624344',3,2,23,NULL,13),(66,0,NULL,0,'2025-11-21 07:07:05.675006','IN_PROGRESS',NULL,0,2,23,NULL,NULL),(67,3,NULL,10,'2025-11-21 07:17:37.125558','SUBMITTED','2025-11-21 07:27:36.934204',3,2,23,10,599),(68,0,NULL,0,'2025-11-21 07:30:04.506993','SUBMITTED','2025-11-21 07:33:24.233111',3,2,23,10,200),(69,3,NULL,10,'2025-11-21 07:33:51.896207','SUBMITTED','2025-11-21 07:34:08.836259',3,2,23,10,17),(70,2,NULL,6.67,'2025-11-21 07:34:40.537066','SUBMITTED','2025-11-21 07:34:52.802733',3,2,23,10,12),(71,1,NULL,3.33,'2025-11-21 07:37:08.380399','SUBMITTED','2025-11-21 07:37:19.870191',3,2,23,10,11),(72,2,NULL,6.67,'2025-11-21 07:37:39.206988','SUBMITTED','2025-11-21 07:37:50.455248',3,2,23,10,11),(73,3,NULL,10,'2025-11-22 16:50:52.022599','SUBMITTED','2025-11-22 16:51:05.187343',3,2,23,10,13),(74,3,NULL,10,'2025-11-22 16:53:01.720733','SUBMITTED','2025-11-22 16:53:09.784885',3,2,23,10,8),(75,0,NULL,0,'2025-11-23 10:36:53.417106','SUBMITTED','2025-11-23 10:37:41.744569',10,2,2,10,48),(76,0,NULL,0,'2025-11-24 06:56:49.320094','IN_PROGRESS',NULL,0,2,1,NULL,NULL),(77,2,NULL,2,'2025-11-24 06:57:40.205097','SUBMITTED','2025-11-24 06:58:39.541262',10,2,1,1,59);
/*!40000 ALTER TABLE `submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `address` varchar(255) DEFAULT NULL,
  `age` int NOT NULL,
  `avatar_url` varchar(255) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `gender` enum('FEMALE','MALE','OTHER') DEFAULT NULL,
  `name` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `refresh_token` mediumtext,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `role_id` bigint DEFAULT NULL,
  `accent_color` varchar(255) DEFAULT NULL,
  `bio` text,
  `is_active` bit(1) NOT NULL,
  `coins` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKp56c1712k691lhsyewcssf40f` (`role_id`),
  CONSTRAINT `FKp56c1712k691lhsyewcssf40f` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'hn',25,'1763457856474-admin_avatar.webp','2025-10-30 14:52:22.386258','anonymous','admin@gmail.com','MALE','I\'m super admin','$2a$10$mZHWrG4/skjpYJw.pIVPveZlwqJEpELk76h8TsrOF9eZi.ECXSYZ.','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbkBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjpbIlJPTEVfVVNFUl9DUkVBVEUiLCJST0xFX1VTRVJfVVBEQVRFIl0sImV4cCI6MTc2NDgzMjUzNSwiaWF0IjoxNzYzOTY4NTM1LCJ1c2VyIjp7ImlkIjoxLCJuYW1lIjoiSSdtIHN1cGVyIGFkbWluIiwiZW1haWwiOiJhZG1pbkBnbWFpbC5jb20ifX0.KH9Zy5oa4QrlH1f-t-DY5hjNDl5VOaYQe3_XsXIBgg1qxWO41RPy8sAE3jJDiDq1pq2LokSgP1Gb3dNvRqIMLA','2025-11-24 07:15:35.697374','admin@gmail.com',1,'green','my name is Truong',_binary '',0),(2,'hn',22,'1763967962105-Anhdaidien.png','2025-10-30 14:52:22.575600','anonymous','user@gmail.com','FEMALE','Regular User','$2a$10$VKWfx5Yb8DV1w79/ZsXmN.tvBqEQzQ9x6JqspjVqa2h3KPwn3Nmhu','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyQGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOlsiUk9MRV9VU0VSX0NSRUFURSIsIlJPTEVfVVNFUl9VUERBVEUiXSwiZXhwIjoxNzY0Nzg5MDU4LCJpYXQiOjE3NjM5MjUwNTgsInVzZXIiOnsiaWQiOjIsIm5hbWUiOiJSZWd1bGFyIFVzZXIiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIn19.gdXilqlTILpL717fEhcTqKoGjMqtU_H_PTfmmf1-0IAuszyKf6O9r6vM0obXxfOm8VGpJiVrjgIZiPF-NRs9pQ','2025-11-24 07:06:02.122938','user@gmail.com',2,NULL,'',_binary '',40),(4,NULL,0,NULL,'2025-10-30 15:00:55.322927','anonymousUser','53017013@sfcollege.edu','FEMALE','Nhựt Trường','$2a$10$JSyLXjDiZ4MOWDIqSSCnLOBT4BWc0.C.fP0zDwEQRLhimgUVYm2ju',NULL,NULL,NULL,2,NULL,NULL,_binary '',0),(5,NULL,0,NULL,'2025-10-30 15:03:08.255710','anonymousUser','truong1@gmail.com','MALE','Nhựt Trường','$2a$10$pAWcyEI3BFpXh9iJ/T8qB.Hj9pi06lnLy8xhOfsfZ4h/g36p8Z8hG',NULL,NULL,NULL,2,NULL,NULL,_binary '',0),(6,NULL,0,'1761839295424-Untitled-1.png','2025-10-30 15:03:59.142912','anonymousUser','truong12@gmail.com','MALE','Nhựt Trường','$2a$10$3WkVIUGFJs9BaBVFaTCFj.im9LlcdPcP.YbvwZFPcuuo.WtTAVbxm','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cnVvbmcxMkBnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjpbIlJPTEVfVVNFUl9DUkVBVEUiLCJST0xFX1VTRVJfVVBEQVRFIl0sImV4cCI6MTc2MjcwMjQxOSwiaWF0IjoxNzYxODM4NDE5LCJ1c2VyIjp7ImlkIjo2LCJuYW1lIjoiTmjhu7F0IFRyxrDhu51uZyIsImVtYWlsIjoidHJ1b25nMTJAZ21haWwuY29tIn19.E8F9yZSsEuYUPtwrLxtLeLpgH5whxcfGXccmg62tglrB0oZlySm8Zx1DOO_N04Adj4MJS3ATfkiM2xN90SXmpg','2025-10-30 15:48:15.446610','admin@gmail.com',2,NULL,NULL,_binary '',0),(7,NULL,0,NULL,'2025-10-31 00:12:07.978899','anonymousUser','truong0795432149@gmail.com','MALE','Trần Nguyễn Nhựt Trường','$2a$10$NwETqWWg2d9c3DvG0567zeBA8hfb1TjRc10g.O.Xc0.KMDBFkSa8e','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cnVvbmcwNzk1NDMyMTQ5QGdtYWlsLmNvbSIsInBlcm1pc3Npb24iOlsiUk9MRV9VU0VSX0NSRUFURSIsIlJPTEVfVVNFUl9VUERBVEUiXSwiZXhwIjoxNzY0NzM4ODk1LCJpYXQiOjE3NjM4NzQ4OTUsInVzZXIiOnsiaWQiOjcsIm5hbWUiOiJUcuG6p24gTmd1eeG7hW4gTmjhu7F0IFRyxrDhu51uZyIsImVtYWlsIjoidHJ1b25nMDc5NTQzMjE0OUBnbWFpbC5jb20ifX0.6KzRHG2ziaKu1UNJYbPUwrWR5UQswjFPL10kH48SDTAW8LbSXqKs_x_4TkjERT9I-iE1OZhaPPBEIBbR89TI3Q','2025-11-23 05:15:26.211762','truong0795432149@gmail.com',2,NULL,NULL,_binary '',50),(9,NULL,0,NULL,'2025-11-18 04:14:14.334234','anonymousUser','trannguyennhuttruong@gmail.com','MALE','TNNT','$2a$10$HtzPtMHOXudAaoKaAwwRSudLqlwvusHgYzZuXXnjEgqPDElwXD4va','eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ0cmFubmd1eWVubmh1dHRydW9uZ0BnbWFpbC5jb20iLCJwZXJtaXNzaW9uIjpbIlJPTEVfVVNFUl9DUkVBVEUiLCJST0xFX1VTRVJfVVBEQVRFIl0sImV4cCI6MTc2NDgzMjQ0MywiaWF0IjoxNzYzOTY4NDQzLCJ1c2VyIjp7ImlkIjo5LCJuYW1lIjoiVE5OVCIsImVtYWlsIjoidHJhbm5ndXllbm5odXR0cnVvbmdAZ21haWwuY29tIn19.0wGUg62KXyNJgm9aLI4OHM1ynbZN-ZPCpyHsD40sZlkgwJh_FcdLu5XTfgAjqdw0OIfWnhF7oJ0c7mgvzIEBag','2025-11-24 07:14:03.535148','trannguyennhuttruong@gmail.com',4,NULL,NULL,_binary '',0);
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_quiz_answers`
--

DROP TABLE IF EXISTS `weekly_quiz_answers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_quiz_answers` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `is_correct` bit(1) NOT NULL,
  `question_id` bigint NOT NULL,
  `selected_option_id` bigint DEFAULT NULL,
  `weekly_submission_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKsdwp9h9d1fejcpfmp70tymwlb` (`question_id`),
  KEY `FKj7ebd5t2uwrty6bbixcdbbfuu` (`selected_option_id`),
  KEY `FKq5ffy2udyu37oq6ofv1rfnki3` (`weekly_submission_id`),
  CONSTRAINT `FKj7ebd5t2uwrty6bbixcdbbfuu` FOREIGN KEY (`selected_option_id`) REFERENCES `question_options` (`id`),
  CONSTRAINT `FKq5ffy2udyu37oq6ofv1rfnki3` FOREIGN KEY (`weekly_submission_id`) REFERENCES `weekly_quiz_submissions` (`id`),
  CONSTRAINT `FKsdwp9h9d1fejcpfmp70tymwlb` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=31 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_quiz_answers`
--

LOCK TABLES `weekly_quiz_answers` WRITE;
/*!40000 ALTER TABLE `weekly_quiz_answers` DISABLE KEYS */;
INSERT INTO `weekly_quiz_answers` VALUES (21,_binary '',141,541,3),(22,_binary '',142,546,3),(23,_binary '',143,551,3),(24,_binary '',144,556,3),(25,_binary '',145,559,3),(26,_binary '',146,563,3),(27,_binary '',147,566,3),(28,_binary '',148,570,3),(29,_binary '',149,575,3),(30,_binary '',150,577,3);
/*!40000 ALTER TABLE `weekly_quiz_answers` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_quiz_questions`
--

DROP TABLE IF EXISTS `weekly_quiz_questions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_quiz_questions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `order_index` int NOT NULL,
  `question_id` bigint NOT NULL,
  `weekly_quiz_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK3efkfe6gobhs8w1fqqvg91mon` (`question_id`),
  KEY `FKrdfmougd2p54mf7mkv59ayayl` (`weekly_quiz_id`),
  CONSTRAINT `FK3efkfe6gobhs8w1fqqvg91mon` FOREIGN KEY (`question_id`) REFERENCES `questions` (`id`),
  CONSTRAINT `FKrdfmougd2p54mf7mkv59ayayl` FOREIGN KEY (`weekly_quiz_id`) REFERENCES `weekly_quizzes` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_quiz_questions`
--

LOCK TABLES `weekly_quiz_questions` WRITE;
/*!40000 ALTER TABLE `weekly_quiz_questions` DISABLE KEYS */;
INSERT INTO `weekly_quiz_questions` VALUES (91,1,141,3),(92,2,142,3),(93,3,143,3),(94,4,144,3),(95,5,145,3),(96,6,146,3),(97,7,147,3),(98,8,148,3),(99,9,149,3),(100,10,150,3);
/*!40000 ALTER TABLE `weekly_quiz_questions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_quiz_submissions`
--

DROP TABLE IF EXISTS `weekly_quiz_submissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_quiz_submissions` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `accuracy_percent` double NOT NULL,
  `coins_earned` int NOT NULL,
  `score` int NOT NULL,
  `submitted_at` datetime(6) DEFAULT NULL,
  `submitted_by` varchar(255) DEFAULT NULL,
  `time_taken` int NOT NULL,
  `student_id` bigint NOT NULL,
  `weekly_quiz_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKen3dfv9v460xcaflb8qwjvegr` (`student_id`),
  KEY `FK7vmvpmkhh5n1w5pdm7llag2yv` (`weekly_quiz_id`),
  CONSTRAINT `FK7vmvpmkhh5n1w5pdm7llag2yv` FOREIGN KEY (`weekly_quiz_id`) REFERENCES `weekly_quizzes` (`id`),
  CONSTRAINT `FKen3dfv9v460xcaflb8qwjvegr` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_quiz_submissions`
--

LOCK TABLES `weekly_quiz_submissions` WRITE;
/*!40000 ALTER TABLE `weekly_quiz_submissions` DISABLE KEYS */;
INSERT INTO `weekly_quiz_submissions` VALUES (2,0,0,0,'2025-11-22 17:02:50.174512','user@gmail.com',14,2,3),(3,100,50,10,'2025-11-23 05:15:26.117320','truong0795432149@gmail.com',16,7,3);
/*!40000 ALTER TABLE `weekly_quiz_submissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_quizzes`
--

DROP TABLE IF EXISTS `weekly_quizzes`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_quizzes` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `description` text,
  `difficulty` varchar(255) DEFAULT NULL,
  `duration_minutes` int NOT NULL,
  `end_date` datetime(6) DEFAULT NULL,
  `is_active` bit(1) NOT NULL,
  `max_reward_coins` int NOT NULL,
  `question_count` int NOT NULL,
  `start_date` datetime(6) DEFAULT NULL,
  `title` varchar(255) DEFAULT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `week_number` int NOT NULL,
  `year` int NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_quizzes`
--

LOCK TABLES `weekly_quizzes` WRITE;
/*!40000 ALTER TABLE `weekly_quizzes` DISABLE KEYS */;
INSERT INTO `weekly_quizzes` VALUES (3,'2025-11-22 13:14:25.085922','admin@gmail.com','đây là tón','Trung bình',10,'2025-11-29 12:59:00.000000',_binary '',50,10,'2025-11-15 13:00:00.000000','Tón','2025-11-22 17:11:11.885818','admin@gmail.com',47,2025);
/*!40000 ALTER TABLE `weekly_quizzes` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `weekly_streaks`
--

DROP TABLE IF EXISTS `weekly_streaks`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `weekly_streaks` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `created_at` datetime(6) DEFAULT NULL,
  `created_by` varchar(255) DEFAULT NULL,
  `current_streak` int NOT NULL,
  `last_completed_week` varchar(255) DEFAULT NULL,
  `longest_streak` int NOT NULL,
  `total_streak_bonus` int NOT NULL,
  `updated_at` datetime(6) DEFAULT NULL,
  `updated_by` varchar(255) DEFAULT NULL,
  `student_id` bigint NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FKpq39mnx1oadl53qmeeuxgtepf` (`student_id`),
  CONSTRAINT `FKpq39mnx1oadl53qmeeuxgtepf` FOREIGN KEY (`student_id`) REFERENCES `users` (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `weekly_streaks`
--

LOCK TABLES `weekly_streaks` WRITE;
/*!40000 ALTER TABLE `weekly_streaks` DISABLE KEYS */;
INSERT INTO `weekly_streaks` VALUES (1,'2025-11-22 14:30:16.593488','user@gmail.com',1,'2025-47',1,0,NULL,NULL,2),(2,'2025-11-23 05:15:26.207669','truong0795432149@gmail.com',1,'2025-47',1,0,NULL,NULL,7);
/*!40000 ALTER TABLE `weekly_streaks` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `withdraw`
--

DROP TABLE IF EXISTS `withdraw`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `withdraw` (
  `id` bigint NOT NULL AUTO_INCREMENT,
  `amount` bigint NOT NULL,
  `processed_at` varchar(255) DEFAULT NULL,
  `requested_at` varchar(255) DEFAULT NULL,
  `seller_id` bigint NOT NULL,
  `status` enum('APPROVED','PENDING','REJECTED') DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `withdraw`
--

LOCK TABLES `withdraw` WRITE;
/*!40000 ALTER TABLE `withdraw` DISABLE KEYS */;
INSERT INTO `withdraw` VALUES (1,560000,NULL,NULL,1,'PENDING'),(2,1,NULL,'2025-11-14T10:11:18.681925',1,'PENDING'),(3,1,NULL,'2025-11-14T10:16:24.002624500',1,'PENDING'),(4,1,NULL,'2025-11-14T10:19:59.873689800',1,'PENDING'),(5,1,NULL,'2025-11-14T10:20:03.758379300',1,'PENDING'),(6,1,NULL,'2025-11-21T18:55:21.466058700',9,'PENDING');
/*!40000 ALTER TABLE `withdraw` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-11-25 22:48:50
