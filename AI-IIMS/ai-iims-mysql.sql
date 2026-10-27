/*
 Navicat Premium Data Transfer

 Source Server         : AI-IIMS
 Source Server Type    : MySQL
 Source Server Version : 100432 (10.4.32-MariaDB)
 Source Host           : localhost:3306
 Source Schema         : ai-iims

 Target Server Type    : MySQL / MariaDB
 Target Server Version : 10.4+
 File Encoding         : 65001

 Date: 22/10/2026 16:37:53
*/

CREATE DATABASE IF NOT EXISTS `ai-iims`
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;
USE `ai-iims`;

SET FOREIGN_KEY_CHECKS=0;
-- ----------------------------
-- Table structure for ai_lesson_suggestions
-- ----------------------------
DROP TABLE IF EXISTS `ai_lesson_suggestions`;
CREATE TABLE `ai_lesson_suggestions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT,
  `teacher_id` BIGINT NOT NULL,
  `suggestion_type` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT NOT NULL,
  `payload` LONGTEXT,
  `status` VARCHAR(255) NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `ai_lesson_suggestions_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT,
  CONSTRAINT `ai_lesson_suggestions_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of ai_lesson_suggestions
-- ----------------------------
START TRANSACTION;
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (1, NULL, 1, 'lesson_section', 'What are Newton''s Laws of Motion?', 'Newton''s Laws of Motion are fundamental principles that describe the relationship between an object and the forces acting upon it, and its motion in response to those forces. There are three laws, each building upon the previous one to explain how objects move.', '{"title": "Introduction to Newton''s Laws", "content": "Newton''s Laws of Motion are fundamental principles that describe the relationship between an object and the forces acting upon it, and its motion in response to those forces. There are three laws, each building upon the previous one to explain how objects move.", "sort_order": 1, "is_collapsible": false}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:08');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (2, NULL, 1, 'lesson_section', 'Newton''s First Law: The Law of Inertia', 'An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This tendency to resist changes in its state of motion is called inertia.', '{"title": "Newton''s First Law", "content": "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This tendency to resist changes in its state of motion is called inertia.", "sort_order": 2, "is_collapsible": true}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:12');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (3, NULL, 1, 'expanded_explanation', 'Real-world Examples of Inertia', 'Think about a book on a table: it stays there until you push it. Or, when a car suddenly stops, you feel yourself lurch forward. This is because your body wants to continue moving forward due to inertia.', '{"title": "Inertia in Action", "content": "Think about a book on a table: it stays there until you push it. Or, when a car suddenly stops, you feel yourself lurch forward. This is because your body wants to continue moving forward due to inertia.", "sort_order": 3}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:27');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (4, NULL, 1, 'lesson_section', 'Newton''s Second Law: Force and Acceleration', 'The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Mathematically, this is represented by the equation F=ma, where F is force, m is mass, and a is acceleration.', '{"title": "Newton''s Second Law", "content": "The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Mathematically, this is represented by the equation F=ma, where F is force, m is mass, and a is acceleration.", "sort_order": 4, "is_collapsible": true}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:18');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (5, NULL, 1, 'lesson_section', 'Newton''s Third Law: Action and Reaction', 'For every action, there is an equal and opposite reaction. This means that whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.', '{"title": "Newton''s Third Law", "content": "For every action, there is an equal and opposite reaction. This means that whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.", "sort_order": 5, "is_collapsible": true}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:20');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (6, NULL, 1, 'activity_prompt', 'Action-Reaction Pair Identification', 'Describe three everyday examples of Newton''s Third Law in action.', '{"title": "Identify Action-Reaction Pairs", "content": "Describe three everyday examples of Newton''s Third Law in action.", "sort_order": 6}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:31');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (7, NULL, 1, 'summary', 'Review of Newton''s Laws', 'Newton''s three laws of motion provide a comprehensive framework for understanding how forces affect the movement of objects. The First Law (Inertia) explains the resistance to changes in motion, the Second Law (F=ma) quantifies the relationship between force, mass, and acceleration, and the Third Law (Action-Reaction) describes the equal and opposite forces in interactions.', '{"title": "Summary of Newton''s Laws", "content": "Newton''s three laws of motion provide a comprehensive framework for understanding how forces affect the movement of objects. The First Law (Inertia) explains the resistance to changes in motion, the Second Law (F=ma) quantifies the relationship between force, mass, and acceleration, and the Third Law (Action-Reaction) describes the equal and opposite forces in interactions.", "sort_order": 7}', 'accepted', '2026-05-17 04:55:43', '2026-05-17 04:56:31');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (8, NULL, 1, 'lesson_section', 'Newton''s First Law: The Law of Inertia', 'Let''s expand on Newton''s First Law. It states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force. This property of matter is called inertia.  Think about why you feel pushed back in your seat when a car accelerates quickly, or why you lurch forward when it brakes suddenly. Your body is simply trying to maintain its current state of motion.', '{"title": "Newton''s First Law: The Law of Inertia", "content": "Let''s expand on Newton''s First Law. It states that an object will remain at rest or in uniform motion in a straight line unless acted upon by an external force. This property of matter is called inertia.  Think about why you feel pushed back in your seat when a car accelerates quickly, or why you lurch forward when it brakes suddenly. Your body is simply trying to maintain its current state of motion.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-05-23 14:17:43', '2026-05-23 14:17:43');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (9, NULL, 1, 'lesson_section', 'Newton''s Second Law: Force, Mass, and Acceleration', 'Newton''s Second Law, F=ma, is a cornerstone of physics. It quantifies the relationship between force, mass, and acceleration. A greater force will produce a greater acceleration for the same mass. Conversely, a greater mass will experience less acceleration for the same applied force. Understanding this law allows us to predict how objects will move when forces are applied.', '{"title": "Newton''s Second Law: Force, Mass, and Acceleration", "content": "Newton''s Second Law, F=ma, is a cornerstone of physics. It quantifies the relationship between force, mass, and acceleration. A greater force will produce a greater acceleration for the same mass. Conversely, a greater mass will experience less acceleration for the same applied force. Understanding this law allows us to predict how objects will move when forces are applied.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-05-23 14:17:43', '2026-05-23 14:17:43');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (10, NULL, 1, 'lesson_section', 'Newton''s Third Law: Action-Reaction', 'Newton''s Third Law, the law of action-reaction, is all about interactions. For every action, there is an equal and opposite reaction. When you push on a wall, the wall pushes back on you with the same amount of force. When a rocket expels gas downwards, the gas pushes the rocket upwards. This law is crucial for understanding how forces work in pairs.', '{"title": "Newton''s Third Law: Action-Reaction", "content": "Newton''s Third Law, the law of action-reaction, is all about interactions. For every action, there is an equal and opposite reaction. When you push on a wall, the wall pushes back on you with the same amount of force. When a rocket expels gas downwards, the gas pushes the rocket upwards. This law is crucial for understanding how forces work in pairs.", "sort_order": 5, "is_collapsible": true}', 'pending', '2026-05-23 14:17:43', '2026-05-23 14:17:43');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (11, NULL, 1, 'summary', 'Key Takeaways on Newton''s Laws', 'Newton''s three laws of motion are foundational to classical mechanics: The First Law (Inertia) describes the tendency of objects to resist changes in their state of motion. The Second Law (F=ma) quantifies the relationship between force, mass, and acceleration. The Third Law (Action-Reaction) explains that forces always occur in equal and opposite pairs. Together, these laws provide a powerful framework for understanding how objects move and interact in the universe.', NULL, 'pending', '2026-05-23 14:17:43', '2026-05-23 14:17:43');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (12, NULL, 1, 'lesson_section', 'Introduction to Newton''s Laws', 'Newton''s Laws of Motion are fundamental principles that describe the relationship between an object and the forces acting upon it, and its motion in response to those forces. There are three laws, each building upon the previous one to explain how objects move.', '{"title": "Introduction to Newton''s Laws", "content": "Newton''s Laws of Motion are fundamental principles that describe the relationship between an object and the forces acting upon it, and its motion in response to those forces. There are three laws, each building upon the previous one to explain how objects move.", "sort_order": 1, "is_collapsible": false}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (13, NULL, 1, 'section_activity', 'Key Concepts Introduction', 'Select the best answer.', '{"activity": {"type": "mini_quiz", "title": "Key Concepts Introduction", "choices": ["The properties of light", "The relationship between objects, forces, and motion", "The principles of thermodynamics", "The behavior of subatomic particles"], "question": "What do Newton''s Laws of Motion primarily describe?", "explanation": "Newton''s Laws are foundational to understanding classical mechanics, explaining how forces influence motion.", "instruction": "Select the best answer.", "correct_answer": "The relationship between objects, forces, and motion"}, "section_title": "Introduction to Newton''s Laws"}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (14, NULL, 1, 'lesson_section', 'Newton''s First Law', 'An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This tendency to resist changes in its state of motion is called inertia.', '{"title": "Newton''s First Law", "content": "An object at rest stays at rest and an object in motion stays in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This tendency to resist changes in its state of motion is called inertia.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (15, NULL, 1, 'section_activity', 'Understanding Inertia', 'Determine if the following statement is true or false.', '{"activity": {"type": "true_false", "title": "Understanding Inertia", "statement": "An object will continue in its state of motion indefinitely if no net force acts upon it.", "explanation": "This is a direct statement of Newton''s First Law of Motion, also known as the Law of Inertia.", "instruction": "Determine if the following statement is true or false.", "correct_answer": true}, "section_title": "Newton''s First Law"}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (16, NULL, 1, 'lesson_section', 'Inertia in Action', 'Think about a book on a table: it stays there until you push it. Or, when a car suddenly stops, you feel yourself lurch forward. This is because your body wants to continue moving forward due to inertia.', '{"title": "Inertia in Action", "content": "Think about a book on a table: it stays there until you push it. Or, when a car suddenly stops, you feel yourself lurch forward. This is because your body wants to continue moving forward due to inertia.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (17, NULL, 1, 'section_activity', 'Personal Inertia Example', 'Think about your own experiences and provide an example.', '{"activity": {"type": "reflection", "title": "Personal Inertia Example", "prompt": "Describe a time you felt the effects of inertia in your daily life.", "instruction": "Think about your own experiences and provide an example.", "correct_answer": null}, "section_title": "Inertia in Action"}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (18, NULL, 1, 'lesson_section', 'Newton''s Second Law', 'The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Mathematically, this is represented by the equation F=ma, where F is force, m is mass, and a is acceleration.', '{"title": "Newton''s Second Law", "content": "The acceleration of an object is directly proportional to the net force acting upon it and inversely proportional to its mass. Mathematically, this is represented by the equation F=ma, where F is force, m is mass, and a is acceleration.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (19, NULL, 1, 'section_activity', 'Force Formula', 'Complete the equation by filling in the missing term.', '{"activity": {"type": "fill_blank", "title": "Force Formula", "sentence": "According to Newton''s Second Law, Force = Mass x ____.", "blank_label": "missing term", "explanation": "The equation F=ma represents Newton''s Second Law of Motion.", "instruction": "Complete the equation by filling in the missing term.", "correct_answer": "acceleration"}, "section_title": "Newton''s Second Law"}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (20, NULL, 1, 'lesson_section', 'Newton''s Third Law', 'For every action, there is an equal and opposite reaction. This means that whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.', '{"title": "Newton''s Third Law", "content": "For every action, there is an equal and opposite reaction. This means that whenever one object exerts a force on a second object, the second object exerts an equal and opposite force on the first.", "sort_order": 5, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (21, NULL, 1, 'section_activity', 'Action-Reaction Pairs', 'Match the action with its corresponding reaction.', '{"activity": {"type": "matching", "pairs": [{"left": "Rocket expels gas downward", "right": "Rocket moves upward"}, {"left": "Foot pushes on ground", "right": "Ground pushes on foot"}, {"left": "Hand pushes wall", "right": "Wall pushes hand"}], "title": "Action-Reaction Pairs", "explanation": "Newton''s Third Law highlights that forces always occur in pairs, equal in magnitude and opposite in direction.", "instruction": "Match the action with its corresponding reaction.", "correct_answer": [{"left": "Rocket expels gas downward", "right": "Rocket moves upward"}, {"left": "Foot pushes on ground", "right": "Ground pushes on foot"}, {"left": "Hand pushes wall", "right": "Wall pushes hand"}]}, "section_title": "Newton''s Third Law"}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (22, NULL, 1, 'lesson_section', 'Summary of Newton''s Laws', 'Newton''s three laws of motion provide a comprehensive framework for understanding how forces affect the movement of objects. The First Law (Inertia) explains the resistance to changes in motion, the Second Law (F=ma) quantifies the relationship between force, mass, and acceleration, and the Third Law (Action-Reaction) describes the equal and opposite forces in interactions.', '{"title": "Summary of Newton''s Laws", "content": "Newton''s three laws of motion provide a comprehensive framework for understanding how forces affect the movement of objects. The First Law (Inertia) explains the resistance to changes in motion, the Second Law (F=ma) quantifies the relationship between force, mass, and acceleration, and the Third Law (Action-Reaction) describes the equal and opposite forces in interactions.", "sort_order": 7, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (23, NULL, 1, 'section_activity', 'Order of Application', 'Arrange the steps in the logical order of how Newton''s laws are typically applied in problem-solving.', '{"activity": {"type": "sequencing", "items": ["Identify the type of forces involved (action-reaction).", "Determine if the object''s state of motion is changing (inertia).", "Calculate force, mass, or acceleration using F=ma."], "title": "Order of Application", "explanation": "While all laws are interconnected, problems often start by considering inertia, then applying F=ma, and finally considering action-reaction pairs if relevant.", "instruction": "Arrange the steps in the logical order of how Newton''s laws are typically applied in problem-solving.", "correct_answer": ["Determine if the object''s state of motion is changing (inertia).", "Calculate force, mass, or acceleration using F=ma.", "Identify the type of forces involved (action-reaction)."]}, "section_title": "Summary of Newton''s Laws"}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (24, NULL, 1, 'expanded_explanation', 'Adding a Visual Aid for F=ma', 'To help illustrate Newton''s Second Law (F=ma), consider adding an image or a short animation. For example, an image showing a small car and a large truck being pushed with the same force, clearly indicating the truck accelerates less due to its greater mass.', '{"title": "Visualizing F=ma", "content": "To better understand Newton''s Second Law (F=ma), visualize scenarios comparing objects of different masses experiencing the same force. For instance, imagine pushing a bicycle and a car with the same effort; the bicycle accelerates much faster because it has less mass.", "sort_order": 6, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (25, NULL, 1, 'summary', 'Lesson Summary', 'This lesson introduced Newton''s Three Laws of Motion: the First Law (Inertia), the Second Law (F=ma), and the Third Law (Action-Reaction). We explored how these laws explain the relationship between forces and the motion of objects, with examples and interactive activities.', '{"title": "Lesson Summary", "content": "This lesson introduced Newton''s Three Laws of Motion: the First Law (Inertia), the Second Law (F=ma), and the Third Law (Action-Reaction). We explored how these laws explain the relationship between forces and the motion of objects, with examples and interactive activities.", "sort_order": 8, "is_collapsible": true}', 'pending', '2026-05-24 07:31:33', '2026-05-24 07:31:33');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (26, NULL, 1, 'lesson_section', 'Introduction to Jose Rizal', 'This section will introduce Jose Rizal, his background, and his significance in Philippine history.', '{"title": "Introduction to Jose Rizal", "content": "Jose Rizal was a Filipino nationalist and polymath during the Spanish colonial period of the Philippines. He is considered a national hero for his advocacy for reforms and his significant role in the Philippine Revolution.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-01 03:25:38', '2026-06-01 03:25:38');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (27, NULL, 1, 'section_activity', 'Rizal''s Identity', 'Complete the sentence about Jose Rizal.', '{"activity": {"type": "fill_blank", "title": "Rizal''s Identity", "sentence": "Jose Rizal was a Filipino nationalist and a prominent figure during the ____ colonial period of the Philippines.", "blank_label": "colonial period", "explanation": "Jose Rizal lived and advocated for reforms during the era when the Philippines was under Spanish rule.", "instruction": "Complete the sentence about Jose Rizal.", "correct_answer": "Spanish"}, "section_title": "Introduction to Jose Rizal"}', 'pending', '2026-06-01 03:25:38', '2026-06-01 03:25:38');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (28, NULL, 1, 'lesson_section', 'Rizal''s Early Life and Education', 'This section covers Rizal''s childhood, his family, and his educational journey both in the Philippines and abroad.', '{"title": "Rizal''s Early Life and Education", "content": "Born in Calamba, Laguna, Rizal displayed exceptional intelligence from a young age. He received his early education from his mother and private tutors, later attending the Ateneo Municipal de Manila and the University of Santo Tomas. He pursued further studies in Europe, particularly in Madrid and Heidelberg.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-01 03:25:38', '2026-06-01 03:25:38');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (29, NULL, 1, 'section_activity', 'Rizal''s Educational Path', 'Arrange the following educational institutions in the order Rizal attended them.', '{"activity": {"type": "sequencing", "items": ["University of Santo Tomas", "Ateneo Municipal de Manila", "Studies in Europe"], "title": "Rizal''s Educational Path", "explanation": "Rizal first attended Ateneo, then UST, and later pursued higher studies in Europe.", "instruction": "Arrange the following educational institutions in the order Rizal attended them.", "correct_answer": ["Ateneo Municipal de Manila", "University of Santo Tomas", "Studies in Europe"]}, "section_title": "Rizal''s Early Life and Education"}', 'pending', '2026-06-01 03:25:38', '2026-06-01 03:25:38');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (30, NULL, 1, 'lesson_section', 'Rizal''s Literary Works', 'This section focuses on Rizal''s most famous writings, including his novels Noli Me Tángere and El filibusterismo, and their impact.', '{"title": "Rizal''s Literary Works", "content": "Rizal''s most influential works are his novels ''Noli Me Tángere'' (Touch Me Not) and ''El filibusterismo'' (The Reign of Greed). These novels exposed the injustices and abuses of the Spanish colonial government and the clergy, awakening the Filipino consciousness.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (31, NULL, 1, 'section_activity', 'Match the Novels', 'Match the novel to its common English translation.', '{"activity": {"type": "matching", "pairs": [{"left": "Noli Me Tángere", "right": "Touch Me Not"}, {"left": "El filibusterismo", "right": "The Reign of Greed"}], "title": "Match the Novels", "explanation": "''Noli Me Tángere'' means ''Touch Me Not'' and ''El filibusterismo'' means ''The Reign of Greed''.", "instruction": "Match the novel to its common English translation.", "correct_answer": [{"left": "Noli Me Tángere", "right": "Touch Me Not"}, {"left": "El filibusterismo", "right": "The Reign of Greed"}]}, "section_title": "Rizal''s Literary Works"}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (32, NULL, 1, 'lesson_section', 'Rizal''s Role in the Propaganda Movement', 'This section explores Rizal''s involvement in the Propaganda Movement and his contributions to the reformist cause.', '{"title": "Rizal''s Role in the Propaganda Movement", "content": "Rizal was a leading figure in the Propaganda Movement, which aimed to achieve political reforms for the Philippines under Spanish rule. He used his writings, speeches, and diplomatic skills to advocate for equality, representation, and human rights for Filipinos.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (33, NULL, 1, 'section_activity', 'Propaganda Movement Goal', 'Determine if the statement about the Propaganda Movement is true or false.', '{"activity": {"type": "true_false", "title": "Propaganda Movement Goal", "statement": "The primary goal of the Propaganda Movement was to achieve immediate independence from Spain.", "explanation": "The Propaganda Movement aimed for reforms within the Spanish system, not immediate independence.", "instruction": "Determine if the statement about the Propaganda Movement is true or false.", "correct_answer": false}, "section_title": "Rizal''s Role in the Propaganda Movement"}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (34, NULL, 1, 'lesson_section', 'Exile and Execution', 'This section details Rizal''s exile to Dapitan and his eventual execution.', '{"title": "Exile and Execution", "content": "Due to his perceived subversive activities, Rizal was exiled to Dapitan in Mindanao. Despite his exile, he continued to contribute to society through education and community development. However, he was eventually arrested, tried, and executed by the Spanish authorities in Bagumbayan (now Luneta Park) on December 30, 1896.", "sort_order": 5, "is_collapsible": true}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (35, NULL, 1, 'section_activity', 'Rizal''s Legacy Reflection', 'Reflect on how Rizal''s execution impacted the Filipino people.', '{"activity": {"type": "reflection", "title": "Rizal''s Legacy Reflection", "prompt": "How do you think Rizal''s execution affected the sentiment of the Filipino people towards Spanish rule?", "instruction": "Reflect on how Rizal''s execution impacted the Filipino people.", "correct_answer": null}, "section_title": "Exile and Execution"}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (36, NULL, 1, 'lesson_section', 'Rizal''s Impact and Legacy', 'This section summarizes Rizal''s lasting influence on Philippine nationalism, identity, and the ongoing pursuit of freedom and justice.', '{"title": "Rizal''s Impact and Legacy", "content": "Jose Rizal remains an enduring symbol of Filipino nationalism and intellectual prowess. His life and works continue to inspire Filipinos to strive for education, justice, and national progress. He is revered for his patriotism, his sacrifices, and his unwavering belief in the potential of the Filipino people.", "sort_order": 6, "is_collapsible": true}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (37, NULL, 1, 'section_activity', 'Identify Rizal''s Contributions', 'Click on the cards that represent Rizal''s contributions or characteristics.', '{"activity": {"type": "clickable_activity", "cards": [{"label": "National Hero", "is_correct": true, "description": "Considered the national hero of the Philippines"}, {"label": "Novelist", "is_correct": true, "description": "Authored ''Noli Me Tángere'' and ''El filibusterismo''"}, {"label": "Revolutionary Leader", "is_correct": false, "description": "Led armed rebellion"}, {"label": "Advocate for Reforms", "is_correct": true, "description": "Pushed for peaceful reforms through writing"}], "title": "Identify Rizal''s Contributions", "question": "Select the cards related to Jose Rizal''s contributions and characteristics.", "explanation": "Rizal is known as a national hero, a novelist, and an advocate for reforms, but he did not lead armed rebellions.", "instruction": "Click on the cards that represent Rizal''s contributions or characteristics.", "correct_answer": ["National Hero", "Novelist", "Advocate for Reforms"]}, "section_title": "Rizal''s Impact and Legacy"}', 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (38, NULL, 1, 'summary', 'Lesson Summary', 'This lesson covered the life and works of Jose Rizal, highlighting his early life, education, literary contributions, role in the Propaganda Movement, exile, execution, and his enduring legacy as the national hero of the Philippines. His writings and advocacy inspired a generation and continue to influence Filipino identity and national pride.', NULL, 'pending', '2026-06-01 03:25:39', '2026-06-01 03:25:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (39, NULL, 1, 'lesson_section', 'What is Photosynthesis?', 'Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment. During photosynthesis in plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.', '{"title": "What is Photosynthesis?", "content": "Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the help of chlorophyll pigment. During photosynthesis in plants, light energy is captured and used to convert water, carbon dioxide, and minerals into oxygen and energy-rich organic compounds.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (40, NULL, 1, 'section_activity', 'Photosynthesis Basics', 'Answer the question.', '{"activity": {"type": "mini_quiz", "title": "Photosynthesis Basics", "choices": ["Carotene", "Chlorophyll", "Anthocyanin", "Xanthophyll"], "question": "What pigment is essential for photosynthesis?", "explanation": "Chlorophyll is the primary pigment that absorbs light energy for photosynthesis.", "instruction": "Answer the question.", "correct_answer": "Chlorophyll"}, "section_title": "What is Photosynthesis?"}', 'accepted', '2026-06-16 04:03:29', '2026-06-16 04:04:57');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (41, NULL, 1, 'lesson_section', 'The Process of Photosynthesis', 'Photosynthesis involves two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). In the light-dependent reactions, light energy is captured by chlorophyll and used to split water molecules, releasing oxygen and producing ATP and NADPH. In the light-independent reactions, ATP and NADPH are used to convert carbon dioxide into glucose.', '{"title": "The Process of Photosynthesis", "content": "Photosynthesis involves two main stages: the light-dependent reactions and the light-independent reactions (Calvin cycle). In the light-dependent reactions, light energy is captured by chlorophyll and used to split water molecules, releasing oxygen and producing ATP and NADPH. In the light-independent reactions, ATP and NADPH are used to convert carbon dioxide into glucose.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (42, NULL, 1, 'section_activity', 'Stages of Photosynthesis', 'Arrange the steps of photosynthesis in the correct order.', '{"activity": {"type": "sequencing", "items": ["Light-dependent reactions", "Light-independent reactions (Calvin cycle)", "Carbon dioxide fixation", "Water splitting and oxygen release"], "title": "Stages of Photosynthesis", "explanation": "Photosynthesis begins with light-dependent reactions, including water splitting, followed by light-independent reactions where carbon dioxide is fixed into glucose.", "instruction": "Arrange the steps of photosynthesis in the correct order.", "correct_answer": ["Water splitting and oxygen release", "Light-dependent reactions", "Carbon dioxide fixation", "Light-independent reactions (Calvin cycle)"]}, "section_title": "The Process of Photosynthesis"}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (43, NULL, 1, 'lesson_section', 'Importance of Photosynthesis', 'Photosynthesis is vital for life on Earth as it produces oxygen, which most organisms need to breathe, and it forms the base of most food chains by creating organic matter from inorganic materials. It also plays a crucial role in regulating the Earth''s atmosphere by consuming carbon dioxide.', '{"title": "Importance of Photosynthesis", "content": "Photosynthesis is vital for life on Earth as it produces oxygen, which most organisms need to breathe, and it forms the base of most food chains by creating organic matter from inorganic materials. It also plays a crucial role in regulating the Earth''s atmosphere by consuming carbon dioxide.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (44, NULL, 1, 'section_activity', 'Photosynthesis Impact', 'Determine if the statement is true or false.', '{"activity": {"type": "true_false", "title": "Photosynthesis Impact", "statement": "Photosynthesis is the primary source of oxygen for Earth''s atmosphere.", "explanation": "Photosynthesis releases oxygen as a byproduct, making it the main source of atmospheric oxygen.", "instruction": "Determine if the statement is true or false.", "correct_answer": true}, "section_title": "Importance of Photosynthesis"}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (45, NULL, 1, 'expanded_explanation', 'Chlorophyll''s Role in Light Absorption', 'Chlorophyll is a green pigment found in chloroplasts. It plays a crucial role in absorbing light energy, primarily in the blue and red parts of the spectrum, while reflecting green light, which is why plants appear green. This absorbed energy is what powers the photosynthetic process.', '{"title": "Chlorophyll''s Role in Light Absorption", "content": "Chlorophyll is a green pigment found in chloroplasts. It plays a crucial role in absorbing light energy, primarily in the blue and red parts of the spectrum, while reflecting green light, which is why plants appear green. This absorbed energy is what powers the photosynthetic process.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (46, NULL, 1, 'summary', 'Key Takeaways from Photosynthesis', 'Photosynthesis is the process plants use to convert light energy into chemical energy (glucose), using carbon dioxide and water, and releasing oxygen. It is essential for life on Earth, providing food and oxygen.', '{"title": "Key Takeaways from Photosynthesis", "content": "Photosynthesis is the process plants use to convert light energy into chemical energy (glucose), using carbon dioxide and water, and releasing oxygen. It is essential for life on Earth, providing food and oxygen.", "sort_order": 5, "is_collapsible": true}', 'pending', '2026-06-16 04:03:29', '2026-06-16 04:03:29');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (47, NULL, 1, 'lesson_section', 'Newton''s First Law and Inertia', 'Newton''s First Law of Motion, often called the Law of Inertia, states that an object at rest will stay at rest, and an object in motion will stay in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This resistance to a change in motion is known as inertia.', '{"title": "Newton''s First Law and Inertia", "content": "Newton''s First Law of Motion, often called the Law of Inertia, states that an object at rest will stay at rest, and an object in motion will stay in motion with the same speed and in the same direction unless acted upon by an unbalanced force. This resistance to a change in motion is known as inertia.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (48, NULL, 1, 'section_activity', 'Understanding Inertia', 'Determine if the following statement is true or false.', '{"activity": {"type": "true_false", "title": "Understanding Inertia", "payload": {"statement": "An object will continue in its state of motion indefinitely without any external force acting on it."}, "statement": "An object will continue in its state of motion indefinitely without any external force acting on it.", "explanation": "This statement describes Newton''s First Law of Motion, the Law of Inertia.", "instruction": "Determine if the following statement is true or false.", "correct_answer": true}, "section_title": "Newton''s First Law"}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (49, NULL, 1, 'lesson_section', 'Illustrating Inertia', 'Consider a book resting on a table. It remains stationary because no unbalanced force is acting on it. When a car brakes suddenly, passengers lurch forward because their bodies tend to continue moving at the same speed due to inertia.', '{"title": "Illustrating Inertia", "content": "Consider a book resting on a table. It remains stationary because no unbalanced force is acting on it. When a car brakes suddenly, passengers lurch forward because their bodies tend to continue moving at the same speed due to inertia.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (50, NULL, 1, 'section_activity', 'Inertia Examples', 'Think about your daily life and provide an example of inertia.', '{"activity": {"type": "reflection", "title": "Inertia Examples", "prompt": "Describe a situation where you have experienced or observed inertia.", "instruction": "Think about your daily life and provide an example of inertia.", "correct_answer": null}, "section_title": "Inertia in Action"}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (51, NULL, 1, 'lesson_section', 'Newton''s Second Law: Force, Mass, and Acceleration', 'Newton''s Second Law of Motion establishes a quantitative relationship between force, mass, and acceleration. It states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This is famously expressed by the equation F=ma.', '{"title": "Newton''s Second Law: Force, Mass, and Acceleration", "content": "Newton''s Second Law of Motion establishes a quantitative relationship between force, mass, and acceleration. It states that the acceleration of an object is directly proportional to the net force acting on it and inversely proportional to its mass. This is famously expressed by the equation F=ma.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (52, NULL, 1, 'section_activity', 'Completing Newton''s Second Law', 'Fill in the missing term in the sentence.', '{"activity": {"type": "fill_blank", "title": "Completing Newton''s Second Law", "payload": {"sentence": "According to Newton''s Second Law, the acceleration of an object is directly proportional to the net force and inversely proportional to its ____."}, "sentence": "According to Newton''s Second Law, the acceleration of an object is directly proportional to the net force and inversely proportional to its ____.", "blank_label": "mass", "explanation": "Newton''s Second Law states that acceleration is inversely proportional to mass (a = F/m).", "instruction": "Fill in the missing term in the sentence.", "correct_answer": "mass"}, "section_title": "Newton''s Second Law"}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (53, NULL, 1, 'lesson_section', 'Newton''s Third Law: Action and Reaction', 'Newton''s Third Law of Motion states that for every action, there is an equal and opposite reaction. This means that forces always occur in pairs. When one object exerts a force on a second object, the second object exerts an equal force back on the first object in the opposite direction.', '{"title": "Newton''s Third Law: Action and Reaction", "content": "Newton''s Third Law of Motion states that for every action, there is an equal and opposite reaction. This means that forces always occur in pairs. When one object exerts a force on a second object, the second object exerts an equal force back on the first object in the opposite direction.", "sort_order": 5, "is_collapsible": true}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (54, NULL, 1, 'section_activity', 'Action-Reaction Examples', 'Click on the examples that demonstrate Newton''s Third Law.', '{"activity": {"type": "clickable_activity", "cards": [{"label": "A rocket expelling gas downwards", "is_correct": true, "description": "The gas pushes the rocket upwards"}, {"label": "A heavy box resting on the floor", "is_correct": false, "description": "The floor supports the box"}, {"label": "A person pushing off a wall", "is_correct": true, "description": "The wall pushes back on the person"}, {"label": "A car accelerating forward", "is_correct": true, "description": "Tires push on the road, road pushes back on tires"}], "title": "Action-Reaction Examples", "payload": {"cards": [{"label": "A rocket expelling gas downwards", "is_correct": true, "description": "The gas pushes the rocket upwards"}, {"label": "A heavy box resting on the floor", "is_correct": false, "description": "The floor supports the box"}, {"label": "A person pushing off a wall", "is_correct": true, "description": "The wall pushes back on the person"}, {"label": "A car accelerating forward", "is_correct": true, "description": "Tires push on the road, road pushes back on tires"}]}, "question": "Which of these scenarios demonstrate Newton''s Third Law?", "explanation": "These examples show pairs of equal and opposite forces.", "instruction": "Click on the examples that demonstrate Newton''s Third Law.", "correct_answer": ["A rocket expelling gas downwards", "A person pushing off a wall", "A car accelerating forward"]}, "section_title": "Newton''s Third Law"}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (55, NULL, 1, 'lesson_section', 'Summary of Newton''s Laws', 'In summary, Newton''s three laws provide a fundamental understanding of motion. The First Law (Inertia) describes the tendency of objects to resist changes in their state of motion. The Second Law (F=ma) quantifies the relationship between force, mass, and acceleration. The Third Law (Action-Reaction) explains that forces occur in equal and opposite pairs.', '{"title": "Summary of Newton''s Laws", "content": "In summary, Newton''s three laws provide a fundamental understanding of motion. The First Law (Inertia) describes the tendency of objects to resist changes in their state of motion. The Second Law (F=ma) quantifies the relationship between force, mass, and acceleration. The Third Law (Action-Reaction) explains that forces occur in equal and opposite pairs.", "sort_order": 7, "is_collapsible": true}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (56, NULL, 1, 'section_activity', 'Matching Newton''s Laws', 'Match each law with its description.', '{"activity": {"type": "matching", "pairs": [{"left": "Newton''s First Law", "right": "Law of Inertia"}, {"left": "Newton''s Second Law", "right": "F = ma"}, {"left": "Newton''s Third Law", "right": "Action-Reaction"}], "title": "Matching Newton''s Laws", "payload": {"pairs": [{"left": "Newton''s First Law", "right": "Law of Inertia"}, {"left": "Newton''s Second Law", "right": "F = ma"}, {"left": "Newton''s Third Law", "right": "Action-Reaction"}]}, "explanation": "This activity reinforces the key concepts of each of Newton''s Laws.", "instruction": "Match each law with its description.", "correct_answer": [{"left": "Newton''s First Law", "right": "Law of Inertia"}, {"left": "Newton''s Second Law", "right": "F = ma"}, {"left": "Newton''s Third Law", "right": "Action-Reaction"}]}, "section_title": "Summary of Newton''s Laws"}', 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (57, NULL, 1, 'summary', 'Key Takeaways: Newton''s Laws', 'Newton''s Three Laws of Motion are cornerstones of classical physics. The First Law (Inertia) describes an object''s resistance to changes in its state of motion. The Second Law (F=ma) quantifies the relationship between force, mass, and acceleration. The Third Law (Action-Reaction) states that forces always occur in equal and opposite pairs. Understanding these laws is crucial for comprehending how forces influence the motion of objects.', NULL, 'pending', '2026-06-16 10:03:52', '2026-06-16 10:03:52');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (58, NULL, 1, 'lesson_section', 'What is Media and Information Literacy?', 'This section will define Media and Information Literacy (MIL) and explain why it is crucial in today''s world.', '{"title": "What is Media and Information Literacy?", "content": "This section will define Media and Information Literacy (MIL) and explain why it is crucial in today''s world.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (59, NULL, 1, 'section_activity', 'Defining MIL', 'Complete the sentence with the correct term.', '{"activity": {"type": "fill_blank", "title": "Defining MIL", "sentence": "Understanding and using media and information effectively is known as ______.", "blank_label": "MIL definition", "explanation": "This helps reinforce the core definition of MIL.", "instruction": "Complete the sentence with the correct term.", "correct_answer": "Media and Information Literacy"}, "section_title": "What is Media and Information Literacy?"}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (60, NULL, 1, 'lesson_section', 'Key Concepts in MIL', 'This section introduces fundamental concepts within MIL, such as media types, information sources, and critical evaluation.', '{"title": "Key Concepts in MIL", "content": "This section introduces fundamental concepts within MIL, such as media types, information sources, and critical evaluation.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (61, NULL, 1, 'section_activity', 'Matching MIL Concepts', 'Match each term to its correct definition.', '{"activity": {"type": "matching", "pairs": [{"left": "Media", "right": "Channels of mass communication"}, {"left": "Information", "right": "Facts and data that inform"}, {"left": "Literacy", "right": "Ability to read and write"}, {"left": "Critical Evaluation", "right": "Assessing credibility and bias"}], "title": "Matching MIL Concepts", "explanation": "This activity helps students differentiate between key MIL terms.", "instruction": "Match each term to its correct definition.", "correct_answer": [{"left": "Media", "right": "Channels of mass communication"}, {"left": "Information", "right": "Facts and data that inform"}, {"left": "Literacy", "right": "Ability to read and write"}, {"left": "Critical Evaluation", "right": "Assessing credibility and bias"}]}, "section_title": "Key Concepts in MIL"}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (62, NULL, 1, 'lesson_section', 'The Role of Media in Society', 'This section explores the various roles media plays in society, including informing, educating, entertaining, and influencing.', '{"title": "The Role of Media in Society", "content": "This section explores the various roles media plays in society, including informing, educating, entertaining, and influencing.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (63, NULL, 1, 'section_activity', 'Media''s Societal Impact', 'Reflect on a time media influenced your opinion or understanding of an event. Describe the media, the event, and the influence.', '{"activity": {"type": "reflection", "title": "Media''s Societal Impact", "prompt": "Reflect on a time media influenced your opinion or understanding of an event. Describe the media, the event, and the influence.", "instruction": "Reflect on a time media influenced your opinion or understanding of an event. Describe the media, the event, and the influence.", "correct_answer": null}, "section_title": "The Role of Media in Society"}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (64, NULL, 1, 'lesson_section', 'Information Overload and Credibility', 'This section discusses the challenges of information overload and provides strategies for evaluating the credibility of information sources.', '{"title": "Information Overload and Credibility", "content": "This section discusses the challenges of information overload and provides strategies for evaluating the credibility of information sources.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (65, NULL, 1, 'section_activity', 'Source Credibility Check', 'Determine if the statement about evaluating information is true or false.', '{"activity": {"type": "true_false", "title": "Source Credibility Check", "statement": "A website ending in .org is always more credible than a website ending in .com.", "explanation": "Domain endings can indicate origin, but not necessarily credibility. Further evaluation is always needed.", "instruction": "Determine if the statement about evaluating information is true or false.", "correct_answer": false}, "section_title": "Information Overload and Credibility"}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (66, NULL, 1, 'lesson_section', 'Developing Media and Information Literacy Skills', 'This section outlines practical steps and skills for becoming a more media and information literate individual.', '{"title": "Developing Media and Information Literacy Skills", "content": "This section outlines practical steps and skills for becoming a more media and information literate individual.", "sort_order": 5, "is_collapsible": true}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (67, NULL, 1, 'section_activity', 'Steps to Evaluating Information', 'Arrange the steps for evaluating information in the correct order.', '{"activity": {"type": "sequencing", "items": ["Consider the source''s authority and potential bias.", "Check for corroboration from other reliable sources.", "Analyze the evidence presented.", "Evaluate the date of publication for timeliness."], "title": "Steps to Evaluating Information", "explanation": "Following these steps can help in determining the reliability of information.", "instruction": "Arrange the steps for evaluating information in the correct order.", "correct_answer": ["Consider the source''s authority and potential bias.", "Evaluate the date of publication for timeliness.", "Analyze the evidence presented.", "Check for corroboration from other reliable sources."]}, "section_title": "Developing Media and Information Literacy Skills"}', 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (68, NULL, 1, 'summary', 'Lesson Summary', 'This lesson introduced Media and Information Literacy (MIL), highlighting its importance, key concepts, the role of media in society, challenges of information overload, and strategies for developing MIL skills. Being media literate empowers individuals to navigate the information landscape critically and responsibly.', NULL, 'pending', '2026-06-16 14:46:16', '2026-06-16 14:46:16');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (69, NULL, 1, 'expanded_explanation', 'The Role of Media in Society', 'In today''s world, media is not just a source of information but also a powerful tool for self-expression, creativity, and shaping public opinion. The rapid advancement of technology has amplified media''s reach, connecting people across the globe and influencing how we perceive and interact with the world around us.', NULL, 'pending', '2026-06-16 15:06:47', '2026-06-16 15:06:47');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (70, NULL, 1, 'lesson_section', 'The Impact of Technology on Connectivity', 'The convergence of technological advancements and increased human connectivity has fundamentally altered the fabric of modern life. This section will explore how these changes have impacted communication, information access, and societal interactions.', '{"title": "The Impact of Technology on Connectivity", "content": "The convergence of technological advancements and increased human connectivity has fundamentally altered the fabric of modern life. This section will explore how these changes have impacted communication, information access, and societal interactions.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-16 15:06:47', '2026-06-16 15:06:47');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (71, NULL, 1, 'section_activity', 'Key Concepts Check', 'Answer the following question based on the introduction.', '{"activity": {"type": "mini_quiz", "title": "Key Concepts Check", "choices": ["Entertainment only", "Information and communication processes", "Personal journaling", "Historical archiving"], "question": "What is a central role of media and other information providers?", "explanation": "The introductory text states that media and information providers play a central role in information and communication processes.", "instruction": "Answer the following question based on the introduction.", "correct_answer": "Information and communication processes"}, "section_title": "Introduction To Media and Information Literacy"}', 'pending', '2026-06-16 15:06:47', '2026-06-16 15:06:47');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (72, NULL, 1, 'summary', 'Lesson Summary', 'This introductory section established the critical role of media and information providers in modern society. It highlighted media as a platform for self-expression and creativity, emphasizing its rapid global spread. Furthermore, it underscored the profound impact of technological advancements on human connectivity and its influence on contemporary life.', NULL, 'pending', '2026-06-16 15:06:47', '2026-06-16 15:06:47');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (73, NULL, 1, 'lesson_section', 'What is Media Information Literacy?', 'Media Information Literacy (MIL) is the ability to access, analyze, evaluate, create, and act using all forms of communication. In today''s world, it''s crucial to be able to navigate the vast amount of information we encounter daily.', '{"title": "What is Media Information Literacy?", "content": "Media Information Literacy (MIL) is the ability to access, analyze, evaluate, create, and act using all forms of communication. In today''s world, it''s crucial to be able to navigate the vast amount of information we encounter daily.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (74, NULL, 1, 'section_activity', 'Defining MIL', 'Complete the sentence with the correct term.', '{"activity": {"type": "fill_blank", "title": "Defining MIL", "sentence": "Media Information Literacy is the ability to access, analyze, evaluate, create, and act using all forms of ____.", "blank_label": "missing word", "explanation": "MIL encompasses all forms of communication in the modern age.", "instruction": "Complete the sentence with the correct term.", "correct_answer": "communication"}, "section_title": "What is Media Information Literacy?"}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (75, NULL, 1, 'lesson_section', 'Why is MIL Important?', 'MIL empowers individuals to be critical consumers and responsible creators of media. It helps combat misinformation, promotes informed decision-making, and fosters active participation in a democratic society.', '{"title": "Why is MIL Important?", "content": "MIL empowers individuals to be critical consumers and responsible creators of media. It helps combat misinformation, promotes informed decision-making, and fosters active participation in a democratic society.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (76, NULL, 1, 'section_activity', 'Importance of MIL', 'Determine if the following statement is true or false.', '{"activity": {"type": "true_false", "title": "Importance of MIL", "statement": "Media Information Literacy is only important for journalists.", "explanation": "MIL is essential for everyone in today''s information-rich world.", "instruction": "Determine if the following statement is true or false.", "correct_answer": false}, "section_title": "Why is MIL Important?"}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (77, NULL, 1, 'lesson_section', 'Key Concepts in MIL', 'Understanding key concepts like media messages, media ownership, media effects, and target audiences helps us analyze and evaluate information more effectively. These concepts allow us to deconstruct media and understand its underlying purposes.', '{"title": "Key Concepts in MIL", "content": "Understanding key concepts like media messages, media ownership, media effects, and target audiences helps us analyze and evaluate information more effectively. These concepts allow us to deconstruct media and understand its underlying purposes.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (78, NULL, 1, 'section_activity', 'Match the MIL Concepts', 'Match each concept on the left with its description on the right.', '{"activity": {"type": "matching", "pairs": [{"left": "Media Message", "right": "The content of communication"}, {"left": "Media Ownership", "right": "Who controls the media"}, {"left": "Media Effects", "right": "Impact on audience"}, {"left": "Target Audience", "right": "Intended recipients"}], "title": "Match the MIL Concepts", "explanation": "Understanding these concepts is key to analyzing media critically.", "instruction": "Match each concept on the left with its description on the right.", "correct_answer": [{"left": "Media Message", "right": "The content of communication"}, {"left": "Media Ownership", "right": "Who controls the media"}, {"left": "Media Effects", "right": "Impact on audience"}, {"left": "Target Audience", "right": "Intended recipients"}]}, "section_title": "Key Concepts in MIL"}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (79, NULL, 1, 'lesson_section', 'Developing MIL Skills', 'Developing MIL skills involves practicing critical thinking, asking questions about sources, identifying biases, and seeking diverse perspectives. It''s an ongoing process of learning and adapting to new media forms.', '{"title": "Developing MIL Skills", "content": "Developing MIL skills involves practicing critical thinking, asking questions about sources, identifying biases, and seeking diverse perspectives. It''s an ongoing process of learning and adapting to new media forms.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (80, NULL, 1, 'section_activity', 'Steps to Evaluate Information', 'Arrange the steps for evaluating information in the correct order.', '{"activity": {"type": "sequencing", "items": ["Identify the source", "Check for bias", "Verify the information", "Consider the purpose"], "title": "Steps to Evaluate Information", "explanation": "A systematic approach helps in critically evaluating any piece of information.", "instruction": "Arrange the steps for evaluating information in the correct order.", "correct_answer": ["Identify the source", "Consider the purpose", "Check for bias", "Verify the information"]}, "section_title": "Developing MIL Skills"}', 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (81, NULL, 1, 'summary', 'Lesson Summary', 'This lesson introduced Media Information Literacy (MIL), defining it as the ability to access, analyze, evaluate, create, and act with media. We explored why MIL is crucial for critical thinking and responsible digital citizenship, discussed key concepts like messages and ownership, and outlined strategies for developing these vital skills. Remember, MIL is an ongoing journey to navigate the complex world of information effectively.', NULL, 'pending', '2026-06-17 10:53:04', '2026-06-17 10:53:04');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (82, NULL, 1, 'lesson_section', 'What is Media Information Literacy?', 'This section will define Media Information Literacy (MIL) and explain its core concepts. It will cover what constitutes ''media'' and ''information'' in the modern context and why understanding them is crucial.', '{"title": "What is Media Information Literacy?", "content": "Media Information Literacy (MIL) is the essential skill set for navigating today''s world. It empowers individuals to access, analyze, evaluate, create, and act using all forms of communication. In essence, it''s about becoming a critical consumer and responsible producer of information and media messages.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (83, NULL, 1, 'section_activity', 'Defining MIL', 'Complete the sentence with the correct term.', '{"activity": {"type": "fill_blank", "title": "Defining MIL", "sentence": "Media Information Literacy is the essential skill set for navigating today''s world, empowering individuals to access, analyze, evaluate, create, and act using all forms of ____.", "blank_label": "missing word", "explanation": "MIL encompasses all forms of communication, from traditional media to digital platforms.", "instruction": "Complete the sentence with the correct term.", "correct_answer": "communication"}, "section_title": "What is Media Information Literacy?"}', 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (84, NULL, 1, 'lesson_section', 'Why is MIL Important?', 'This section will explore the importance of MIL in combating misinformation, making informed decisions, participating in democracy, and fostering digital citizenship.', '{"title": "Why is MIL Important?", "content": "In an era flooded with information, MIL is not just a skill, but a necessity. It helps us discern credible sources from fake news, understand the persuasive techniques used in media, and make informed decisions in our personal, academic, and civic lives. Developing MIL skills is key to becoming a responsible and engaged digital citizen.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (85, NULL, 1, 'section_activity', 'Real-World Impact of MIL', 'Reflect on a time when media information influenced your decision. How could MIL have helped you evaluate that information?', '{"activity": {"type": "reflection", "title": "Real-World Impact of MIL", "prompt": "Reflect on a time when media information influenced your decision. How could MIL have helped you evaluate that information?", "instruction": "Reflect on a time when media information influenced your decision. How could MIL have helped you evaluate that information?", "correct_answer": null}, "section_title": "Why is MIL Important?"}', 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (86, NULL, 1, 'lesson_section', 'Key Concepts in MIL', 'This section will introduce fundamental concepts such as media messages, audience, author, purpose, and content. It will also touch upon the different types of media and their characteristics.', '{"title": "Key Concepts in MIL", "content": "Understanding MIL involves grasping key concepts. ''Media messages'' are the content we consume. Recognizing the ''author'' and their ''purpose'' helps us understand potential biases. Analyzing the ''audience'' reveals who the message is intended for and how it might be received. Furthermore, understanding the various ''types of media''—from print to digital—and their unique characteristics is vital for critical evaluation.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (87, NULL, 1, 'section_activity', 'MIL Concept Match-Up', 'Match each MIL concept to its correct definition.', '{"activity": {"type": "matching", "pairs": [{"left": "Author", "right": "The creator of the media message."}, {"left": "Purpose", "right": "The reason the message was created."}, {"left": "Audience", "right": "The intended recipients of the message."}, {"left": "Media Message", "right": "The content being communicated."}], "title": "MIL Concept Match-Up", "explanation": "Understanding these core concepts is fundamental to analyzing media critically.", "instruction": "Match each MIL concept to its correct definition.", "correct_answer": [{"left": "Author", "right": "The creator of the media message."}, {"left": "Purpose", "right": "The reason the message was created."}, {"left": "Audience", "right": "The intended recipients of the message."}, {"left": "Media Message", "right": "The content being communicated."}]}, "section_title": "Key Concepts in MIL"}', 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (88, NULL, 1, 'expanded_explanation', 'The Evolution of Media', 'Discuss how the definition of ''media'' has expanded from traditional forms (print, radio, TV) to include digital platforms (websites, social media, podcasts, video games), and how this evolution impacts the practice of MIL.', NULL, 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (89, NULL, 1, 'summary', 'Key Takeaways from Introduction to MIL', 'This lesson introduced Media Information Literacy (MIL) as a crucial skill for navigating the modern world. We defined MIL, explored its importance in combating misinformation and fostering digital citizenship, and identified key concepts like author, purpose, audience, and media messages. Understanding these elements empowers us to become more critical consumers and responsible creators of information.', NULL, 'pending', '2026-06-17 10:58:58', '2026-06-17 10:58:58');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (90, NULL, 1, 'lesson_section', 'What is Media and Information Literacy?', 'This section defines Media and Information Literacy (MIL) and explains its relevance in today''s world. It will cover the basic concepts of media, information, and literacy, and why understanding them is crucial.', '{"title": "What is Media and Information Literacy?", "content": "Media and Information Literacy (MIL) is a set of competencies that allows individuals to access, analyze, evaluate, create, and act using all forms of communication. In an era saturated with information from various media channels, MIL empowers individuals to navigate this landscape critically and responsibly.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (91, NULL, 1, 'section_activity', 'Defining MIL', 'Fill in the missing word to complete the definition of Media and Information Literacy.', '{"activity": {"type": "fill_blank", "title": "Defining MIL", "sentence": "Media and Information Literacy is a set of competencies that allows individuals to ____, analyze, evaluate, create, and act using all forms of communication.", "blank_label": "missing word", "explanation": "Accessing information is the first step in Media and Information Literacy.", "instruction": "Fill in the missing word to complete the definition of Media and Information Literacy.", "correct_answer": "access"}, "section_title": "What is Media and Information Literacy?"}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (92, NULL, 1, 'lesson_section', 'The Evolving Media Landscape', 'This section explores the rapid changes in media over time, from traditional media to digital and social media. It will highlight the characteristics of each, their impact on society, and the challenges they present.', '{"title": "The Evolving Media Landscape", "content": "The media landscape has transformed dramatically. Traditional media like print, radio, and television once dominated. Today, the digital revolution has given rise to the internet, social media, and user-generated content, creating a dynamic and interconnected information ecosystem. This evolution brings both opportunities for broader communication and challenges in discerning credible information.", "sort_order": 2, "is_collapsible": true}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (93, NULL, 1, 'section_activity', 'Media Types Match', 'Match the media type with its description.', '{"activity": {"type": "matching", "pairs": [{"left": "Traditional Media", "right": "Examples include print, radio, and television."}, {"left": "Digital Media", "right": "Content delivered via the internet and electronic devices."}, {"left": "Social Media", "right": "Platforms for user-generated content and online interaction."}], "title": "Media Types Match", "explanation": "Understanding the distinctions between media types is fundamental to MIL.", "instruction": "Match the media type with its description.", "correct_answer": [{"left": "Traditional Media", "right": "Examples include print, radio, and television."}, {"left": "Digital Media", "right": "Content delivered via the internet and electronic devices."}, {"left": "Social Media", "right": "Platforms for user-generated content and online interaction."}]}, "section_title": "The Evolving Media Landscape"}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (94, NULL, 1, 'lesson_section', 'Key Concepts: Information Sources and Media Messages', 'This section delves into identifying different types of information sources (e.g., primary, secondary) and understanding how media messages are constructed, including the role of gatekeepers and the identification of bias.', '{"title": "Key Concepts: Information Sources and Media Messages", "content": "Effective MIL involves distinguishing between various information sources. Primary sources offer firsthand accounts, while secondary sources interpret primary information. Furthermore, understanding media messages requires analyzing their construction, recognizing who controls the message (gatekeepers), and identifying potential biases that might influence perception.", "sort_order": 3, "is_collapsible": true}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (95, NULL, 1, 'section_activity', 'Source Identification', 'Determine if the statement about information sources is true or false.', '{"activity": {"type": "true_false", "title": "Source Identification", "statement": "A biography written by a historian about a historical figure is an example of a primary source.", "explanation": "A biography written by a historian is a secondary source, as it interprets primary information.", "instruction": "Determine if the statement about information sources is true or false.", "correct_answer": false}, "section_title": "Key Concepts: Information Sources and Media Messages"}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (96, NULL, 1, 'lesson_section', 'The Importance of Critical Thinking in MIL', 'This section emphasizes the role of critical thinking skills in evaluating media content. It will cover techniques for questioning information, identifying misinformation and disinformation, and making informed judgments.', '{"title": "The Importance of Critical Thinking in MIL", "content": "Critical thinking is the cornerstone of Media and Information Literacy. It involves questioning the origin, purpose, and accuracy of information. By applying critical thinking, individuals can better identify misinformation (unintentionally false information) and disinformation (intentionally false information), protecting themselves and others from its harmful effects.", "sort_order": 4, "is_collapsible": true}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (97, NULL, 1, 'section_activity', 'Critical Evaluation Practice', 'Think about a piece of news or information you encountered recently. What questions would you ask to critically evaluate its credibility?', '{"activity": {"type": "reflection", "title": "Critical Evaluation Practice", "prompt": "Think about a piece of news or information you encountered recently. What questions would you ask to critically evaluate its credibility?", "instruction": "Think about a piece of news or information you encountered recently. What questions would you ask to critically evaluate its credibility?", "correct_answer": null}, "section_title": "The Importance of Critical Thinking in MIL"}', 'pending', '2026-06-17 11:10:39', '2026-06-17 11:10:39');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (98, NULL, 1, 'lesson_section', 'ILAW Learning Objectives', 'This section will outline the key learning objectives for students regarding Communication and Media.', '{"title": "ILAW Learning Objectives", "content": "Upon completion of this lesson, students will be able to:\n\n*   Define key terms related to communication and media.\n*   Identify different types of media and their characteristics.\n*   Understand the basic concepts of media messages and their impact.\n*   Recognize the role of media in society.", "sort_order": 1, "is_collapsible": true}', 'pending', '2026-06-24 10:40:35', '2026-06-24 10:40:35');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (99, NULL, 1, 'section_activity', 'Key Term Check', 'Complete the sentence with the correct term related to communication and media.', '{"activity": {"type": "fill_blank", "cards": [], "items": [], "pairs": [], "title": "Key Term Check", "prompt": "Complete the sentence with the correct term related to communication and media.", "choices": ["", "", "", ""], "question": "", "sentence": "The process of sharing information and ideas is called ____.", "statement": "", "blank_label": "missing word", "explanation": "Communication is the fundamental process of conveying information.", "instruction": "Complete the sentence with the correct term related to communication and media.", "record_score": true, "correct_answer": "communication"}, "section_title": "ILAW Learning Objectives"}', 'pending', '2026-06-24 10:40:35', '2026-06-24 10:40:35');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (100, NULL, 1, 'expanded_explanation', 'Suggested content for Learning Objectives', 'At the end of this lesson, students will be able to:

*   Define "media" and "information" in their own words.
*   Identify at least three (3) different types of media and provide examples for each.
*   Explain the basic differences between traditional and new media.
*   Recognize the importance of media and information literacy in everyday life.', '{"target_field": {"label": "Learning Objectives", "field_name": "learning_objectives", "section_key": "intentions"}}', 'pending', '2026-06-24 10:50:50', '2026-06-24 10:50:50');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (101, NULL, 1, 'expanded_explanation', 'Suggested content for Target Competencies', '*   Demonstrate an understanding of the definitions of media and information.
*   Classify different types of media and provide relevant examples.
*   Differentiate between traditional and new media based on their characteristics.
*   Articulate the significance of media and information literacy in navigating the modern world.', '{"target_field": {"label": "Target Competencies", "field_name": "target_competencies", "section_key": "intentions"}}', 'pending', '2026-06-24 10:52:25', '2026-06-24 10:52:25');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (102, NULL, 1, 'expanded_explanation', 'Suggested content for Lesson Flow', '1.  **Opening (10 mins):** Begin with a "Media Brainstorm." Ask students to list all the media they encountered in the last 24 hours (e.g., TV shows, social media posts, news articles, radio ads). Discuss their lists, highlighting the variety of media. Briefly introduce the lesson''s topic: understanding what media and information are and why it''s important to be critical consumers.
2.  **Concept Development (20 mins):** Define "media" and "information" using clear, simple language and relatable examples. Present different types of media (print, broadcast, digital/new media) with visual aids or short video clips showcasing examples for each. Facilitate a brief discussion comparing and contrasting traditional media (e.g., newspapers, radio) with new media (e.g., social media, blogs), focusing on characteristics like interactivity, reach, and content creation.
3.  **Guided Practice (15 mins):** Activity: "Media Type Sort." Provide students with a list of media examples (or show images/short clips). In pairs or small groups, have them categorize each example under "Traditional Media" or "New Media," justifying their choices. Circulate to provide support and clarify misconceptions.
4.  **Closure (5 mins):** "Exit Ticket." Ask students to write down one key difference between traditional and new media OR one reason why media and information literacy is important in their daily lives on a small piece of paper before leaving. Briefly recap the main points of the lesson.', '{"target_field": {"label": "Lesson Flow", "field_name": "lesson_flow", "section_key": "learning_experience"}}', 'pending', '2026-06-24 10:52:55', '2026-06-24 10:52:55');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (103, NULL, 1, 'expanded_explanation', 'Suggested content for Activities', '1. **Media Type Sort:** In pairs or small groups, students will be given a list of media examples (e.g., a newspaper, a TikTok video, a radio broadcast, a blog post, a movie trailer, a physical book). They will categorize each example as either ''Traditional Media'' or ''New Media'' and write down at least one reason for their categorization. 
2. **Exit Ticket:** Students will write on a small piece of paper one key difference between traditional and new media OR one reason why media and information literacy is important in their daily lives.', '{"target_field": {"label": "Activities", "field_name": "activities", "section_key": "learning_experience"}}', 'pending', '2026-06-24 10:54:41', '2026-06-24 10:54:41');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (104, NULL, 1, 'expanded_explanation', 'Suggested content for Strategy', 'Employ a variety of teaching strategies to cater to diverse learning needs. Begin with a whole-class discussion and brainstorming session to activate prior knowledge. Utilize visual aids such as images, short video clips, and a presentation to define key terms and concepts. Facilitate pair or small-group work for the "Media Type Sort" activity to encourage peer learning and collaboration. Provide sentence starters or a graphic organizer for students who need additional support in categorizing media types or articulating the importance of media literacy. Offer opportunities for students to share their justifications for media categorization, fostering critical thinking and communication skills. Use an "Exit Ticket" as a quick formative assessment to gauge understanding of the core concepts.', '{"target_field": {"label": "Strategy", "field_name": "strategy", "section_key": "learning_experience"}}', 'pending', '2026-06-24 10:55:21', '2026-06-24 10:55:21');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (105, NULL, 1, 'expanded_explanation', 'Formative Assessment Content', 'Observe student participation in the "Media Brainstorm" to gauge initial understanding of media types. During the "Media Type Sort" activity, listen to group discussions and justifications to identify misconceptions about traditional vs. new media. Review "Exit Tickets" to check for comprehension of the key difference between traditional and new media or the importance of media literacy. Note students who struggle to categorize media or articulate the significance of media literacy for targeted support.', '{"target_field": {"label": "Formative Assessment", "field_name": "formative_assessment", "section_key": "assessing_learning"}}', 'pending', '2026-06-24 10:55:46', '2026-06-24 10:55:46');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (106, NULL, 1, 'mini_quiz', 'Question 1', 'What is the primary definition of ''media''?', '{"id": "q1", "type": "multiple_choice", "points": 1, "choices": ["Tools or channels used to store and deliver information or data.", "Only newspapers and television.", "The personal opinions of individuals.", "The act of communicating verbally."], "options": ["Tools or channels used to store and deliver information or data.", "Only newspapers and television.", "The personal opinions of individuals.", "The act of communicating verbally."], "question": "What is the primary definition of ''media''?", "explanation": "Media refers to the communication channels used to store and deliver information or data, encompassing various forms and technologies.", "correct_answer": 0}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (107, NULL, 1, 'mini_quiz', 'Question 2', 'Which of the following best describes ''information''?', '{"id": "q2", "type": "multiple_choice", "points": 1, "choices": ["A collection of random sounds.", "Facts, data, and knowledge communicated or received.", "The physical appearance of a medium.", "A type of media device."], "options": ["A collection of random sounds.", "Facts, data, and knowledge communicated or received.", "The physical appearance of a medium.", "A type of media device."], "question": "Which of the following best describes ''information''?", "explanation": "Information is defined as facts, data, or knowledge that is conveyed or received through various channels.", "correct_answer": 1}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (108, NULL, 1, 'mini_quiz', 'Question 3', 'Which of these is an example of PRINT media?', '{"id": "q3", "type": "multiple_choice", "points": 1, "choices": ["A podcast", "A website blog", "A daily newspaper", "A live television broadcast"], "options": ["A podcast", "A website blog", "A daily newspaper", "A live television broadcast"], "question": "Which of these is an example of PRINT media?", "explanation": "A daily newspaper is a form of print media because its content is physically printed on paper.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (109, NULL, 1, 'mini_quiz', 'Question 4', 'Which type of media relies on broadcasting signals to reach its audience?', '{"id": "q4", "type": "multiple_choice", "points": 1, "choices": ["Digital Media", "Print Media", "Broadcast Media", "Physical Books"], "options": ["Digital Media", "Print Media", "Broadcast Media", "Physical Books"], "question": "Which type of media relies on broadcasting signals to reach its audience?", "explanation": "Broadcast media, such as radio and television, transmit content via signals to be received by a wide audience.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (110, NULL, 1, 'mini_quiz', 'Question 5', 'Social media platforms like Facebook and Instagram are categorized as:', '{"id": "q5", "type": "multiple_choice", "points": 1, "choices": ["Traditional Media", "New Media", "Print Media", "Broadcast Media"], "options": ["Traditional Media", "New Media", "Print Media", "Broadcast Media"], "question": "Social media platforms like Facebook and Instagram are categorized as:", "explanation": "Social media platforms fall under New Media due to their digital nature, interactivity, and user-generated content.", "correct_answer": 1}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (111, NULL, 1, 'mini_quiz', 'Question 6', 'What is a key characteristic that differentiates NEW media from TRADITIONAL media?', '{"id": "q6", "type": "multiple_choice", "points": 1, "choices": ["Lower production cost", "One-way communication", "Limited audience reach", "Greater interactivity and user participation"], "options": ["Lower production cost", "One-way communication", "Limited audience reach", "Greater interactivity and user participation"], "question": "What is a key characteristic that differentiates NEW media from TRADITIONAL media?", "explanation": "New media typically offers greater interactivity, allowing users to participate, create content, and engage with it, unlike the often one-way nature of traditional media.", "correct_answer": 3}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (112, NULL, 1, 'mini_quiz', 'Question 7', 'In the ''Media Type Sort'' activity, a radio broadcast would most likely be classified as:', '{"id": "q7", "type": "multiple_choice", "points": 1, "choices": ["New Media", "Digital Media", "Traditional Media", "Interactive Media"], "options": ["New Media", "Digital Media", "Traditional Media", "Interactive Media"], "question": "In the ''Media Type Sort'' activity, a radio broadcast would most likely be classified as:", "explanation": "Radio broadcasting has historically been a form of traditional media, characterized by one-way dissemination of audio content.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (113, NULL, 1, 'mini_quiz', 'Question 8', 'A blog post that allows readers to comment and share is an example of:', '{"id": "q8", "type": "multiple_choice", "points": 1, "choices": ["Purely traditional media", "A characteristic of new media", "Print media only", "Broadcast media"], "options": ["Purely traditional media", "A characteristic of new media", "Print media only", "Broadcast media"], "question": "A blog post that allows readers to comment and share is an example of:", "explanation": "The ability for readers to comment and share is a form of interactivity, which is a hallmark of new media.", "correct_answer": 1}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (114, NULL, 1, 'mini_quiz', 'Question 9', 'Why is Media and Information Literacy considered important in everyday life?', '{"id": "q9", "type": "multiple_choice", "points": 1, "choices": ["It helps us avoid all forms of media.", "It allows us to uncritically accept all information presented.", "It enables us to access, analyze, evaluate, and create media messages effectively.", "It is only relevant for journalists and media professionals."], "options": ["It helps us avoid all forms of media.", "It allows us to uncritically accept all information presented.", "It enables us to access, analyze, evaluate, and create media messages effectively.", "It is only relevant for journalists and media professionals."], "question": "Why is Media and Information Literacy considered important in everyday life?", "explanation": "Media and Information Literacy equips individuals with the skills to critically engage with and create media, which is essential in today''s information-rich environment.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (115, NULL, 1, 'mini_quiz', 'Question 10', 'Which formative assessment strategy involves observing student discussions about media categories?', '{"id": "q10", "type": "multiple_choice", "points": 1, "choices": ["Exit Ticket", "Media Brainstorm", "Media Type Sort observation", "Quizzing"], "options": ["Exit Ticket", "Media Brainstorm", "Media Type Sort observation", "Quizzing"], "question": "Which formative assessment strategy involves observing student discussions about media categories?", "explanation": "Observing discussions during the ''Media Type Sort'' activity allows the teacher to gauge student understanding and identify misconceptions.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (116, NULL, 1, 'mini_quiz', 'Question 11', 'The ''Exit Ticket'' activity is primarily used for:', '{"id": "q11", "type": "multiple_choice", "points": 1, "choices": ["Introducing new concepts", "Group collaboration", "Formative assessment of key takeaways", "Extensive research"], "options": ["Introducing new concepts", "Group collaboration", "Formative assessment of key takeaways", "Extensive research"], "question": "The ''Exit Ticket'' activity is primarily used for:", "explanation": "Exit tickets serve as a quick check for understanding at the end of a lesson, assessing if students grasped the main points.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (117, NULL, 1, 'mini_quiz', 'Question 12', 'Which learning objective does identifying examples of traditional and new media address?', '{"id": "q12", "type": "multiple_choice", "points": 1, "choices": ["Define ''media'' and ''information''", "Identify different types of media", "Explain differences between traditional and new media", "Recognize the importance of media literacy"], "options": ["Define ''media'' and ''information''", "Identify different types of media", "Explain differences between traditional and new media", "Recognize the importance of media literacy"], "question": "Which learning objective does identifying examples of traditional and new media address?", "explanation": "Categorizing specific examples under ''Traditional'' or ''New Media'' directly aligns with the objective of identifying different types of media.", "correct_answer": 1}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (118, NULL, 1, 'mini_quiz', 'Question 13', 'What is the goal of defining ''media'' and ''information'' in their own words?', '{"id": "q13", "type": "multiple_choice", "points": 1, "choices": ["To test memorization of complex definitions.", "To ensure students can articulate basic understanding.", "To prepare students for advanced media analysis.", "To discourage the use of media."], "options": ["To test memorization of complex definitions.", "To ensure students can articulate basic understanding.", "To prepare students for advanced media analysis.", "To discourage the use of media."], "question": "What is the goal of defining ''media'' and ''information'' in their own words?", "explanation": "Asking students to define terms in their own words assesses their comprehension and ability to express the core meaning.", "correct_answer": 1}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (119, NULL, 1, 'mini_quiz', 'Question 14', 'Which activity best helps students differentiate between traditional and new media?', '{"id": "q14", "type": "multiple_choice", "points": 1, "choices": ["Media Brainstorm", "Exit Ticket", "Media Type Sort", "Teacher Lecture"], "options": ["Media Brainstorm", "Exit Ticket", "Media Type Sort", "Teacher Lecture"], "question": "Which activity best helps students differentiate between traditional and new media?", "explanation": "The ''Media Type Sort'' activity requires students to actively classify media examples, forcing them to consider the characteristics that differentiate traditional from new media.", "correct_answer": 2}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (120, NULL, 1, 'mini_quiz', 'Question 15', 'A student writes on their Exit Ticket: ''New media is easier to share instantly.'' This demonstrates understanding of:', '{"id": "q15", "type": "multiple_choice", "points": 1, "choices": ["The definition of information.", "A key difference between traditional and new media.", "The importance of print media.", "How to create broadcast media."], "options": ["The definition of information.", "A key difference between traditional and new media.", "The importance of print media.", "How to create broadcast media."], "question": "A student writes on their Exit Ticket: ''New media is easier to share instantly.'' This demonstrates understanding of:", "explanation": "The statement highlights a characteristic difference in speed and reach, which distinguishes new media from many traditional forms.", "correct_answer": 1}', 'pending', '2026-06-24 10:56:09', '2026-06-24 10:56:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (121, NULL, 1, 'expanded_explanation', 'Suggested content for Remediation', 'For students who struggled to differentiate between traditional and new media during the ''Media Type Sort'' activity, provide a graphic organizer with two columns: ''Traditional Media'' and ''New Media.'' List various media examples (e.g., newspaper, blog, radio, social media post, TV show, podcast) and have students cut and paste them into the correct column, or draw lines to connect them. Afterwards, facilitate a brief whole-class discussion where students explain their reasoning for placing specific examples in each category. For students who had difficulty grasping the importance of media literacy, provide them with short, real-world scenarios (e.g., encountering a fake news headline, seeing a misleading advertisement) and ask them to identify how media literacy skills could help them navigate each situation. A brief follow-up discussion can reinforce these practical applications.', '{"target_field": {"label": "Remediation", "field_name": "remediation", "section_key": "ways_forward"}}', 'pending', '2026-06-24 10:57:09', '2026-06-24 10:57:09');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (122, NULL, 1, 'expanded_explanation', 'Suggested content for the ''Enrichment'' field', 'Challenge students to explore the evolution of a specific media type (e.g., how news reporting has changed from print to digital). Have them create a short infographic or presentation comparing and contrasting its traditional and new media forms, highlighting key differences in content, audience interaction, and creation process. Alternatively, provide students with a current news article or social media post and ask them to analyze its potential biases, intended audience, and credibility, using the concepts of media literacy learned in the lesson.', '{"target_field": {"label": "Enrichment", "field_name": "enrichment", "section_key": "ways_forward"}}', 'pending', '2026-06-24 10:59:54', '2026-06-24 10:59:54');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (123, NULL, 1, 'expanded_explanation', 'Suggested content for Learning Objectives', 'At the end of the lesson, learners will be able to:
- Define "media" and "information" using their own words.
- Differentiate between media and information.
- Identify at least three (3) different types of media.
- Explain the importance of media and information literacy in today''s society.', '{"target_field": {"label": "Learning Objectives", "field_name": "learning_objectives", "section_key": "intentions"}}', 'pending', '2026-06-24 11:04:37', '2026-06-24 11:04:37');
INSERT INTO `ai_lesson_suggestions` (`id`, `lesson_id`, `teacher_id`, `suggestion_type`, `title`, `content`, `payload`, `status`, `created_at`, `updated_at`) VALUES (124, NULL, 1, 'expanded_explanation', 'Suggested content for Target Competencies', 'Upon completion of this lesson, learners will be able to demonstrate an understanding of the foundational concepts of media and information, including their definitions, distinctions, and various forms, and articulate the significance of media and information literacy in contemporary society.', '{"target_field": {"label": "Target Competencies", "field_name": "target_competencies", "section_key": "intentions"}}', 'pending', '2026-06-24 11:05:26', '2026-06-24 11:05:26');
COMMIT;
-- ----------------------------
-- Table structure for cache
-- ----------------------------
DROP TABLE IF EXISTS `cache`;
CREATE TABLE `cache` (
  `key` VARCHAR(255) NOT NULL,
  `value` LONGTEXT NOT NULL,
  `expiration` BIGINT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of cache
-- ----------------------------
START TRANSACTION;
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('ai-iims-cache-5aa6fa9f4e056dcfb24b9535b14665c8', 'i:1;', 1792656679);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('ai-iims-cache-5aa6fa9f4e056dcfb24b9535b14665c8:timer', 'i:1792656679;', 1792656679);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('ai-iims-cache-a6cf3449fbccdc26d9aeadb6f26b8c25', 'i:1;', 1792657236);
INSERT INTO `cache` (`key`, `value`, `expiration`) VALUES ('ai-iims-cache-a6cf3449fbccdc26d9aeadb6f26b8c25:timer', 'i:1792657236;', 1792657236);
COMMIT;
-- ----------------------------
-- Table structure for cache_locks
-- ----------------------------
DROP TABLE IF EXISTS `cache_locks`;
CREATE TABLE `cache_locks` (
  `key` VARCHAR(255) NOT NULL,
  `owner` VARCHAR(255) NOT NULL,
  `expiration` BIGINT NOT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of cache_locks
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for failed_jobs
-- ----------------------------
DROP TABLE IF EXISTS `failed_jobs`;
CREATE TABLE `failed_jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `uuid` VARCHAR(255) NOT NULL,
  `connection` LONGTEXT NOT NULL,
  `queue` LONGTEXT NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `exception` LONGTEXT NOT NULL,
  `failed_at` LONGTEXT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of failed_jobs
-- ----------------------------
START TRANSACTION;
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (1, '5b586a72-95c9-447d-9cbc-0c90a0d073f9', 'database', 'default', '{"uuid":"5b586a72-95c9-447d-9cbc-0c90a0d073f9","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":1:{s:8:\"lessonId\";i:8;}","batchId":null},"createdAt":1783864763,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\acer\Codes\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle()
#1 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#3 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#4 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#5 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call()
#6 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}()
#7 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#8 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then()
#9 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow()
#10 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}()
#11 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#12 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then()
#13 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware()
#14 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call()
#15 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process()
#17 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob()
#18 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob()
#19 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker()
#20 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#23 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#24 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#25 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call()
#26 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute()
#27 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run()
#28 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run()
#29 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand()
#30 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun()
#31 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run()
#32 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle()
#33 C:\Users\acer\Codes\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand()
#34 {main}', '2026-07-12 13:59:27');
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (2, '5a88a576-14af-409c-aca3-2c9de56a297a', 'database', 'default', '{"uuid":"5a88a576-14af-409c-aca3-2c9de56a297a","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":1:{s:8:\"lessonId\";i:9;}","batchId":null},"createdAt":1783864763,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\acer\Codes\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle()
#1 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#3 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#4 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#5 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call()
#6 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}()
#7 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#8 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then()
#9 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow()
#10 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}()
#11 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#12 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then()
#13 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware()
#14 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call()
#15 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process()
#17 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob()
#18 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob()
#19 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker()
#20 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#23 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#24 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#25 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call()
#26 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute()
#27 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run()
#28 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run()
#29 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand()
#30 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun()
#31 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run()
#32 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle()
#33 C:\Users\acer\Codes\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand()
#34 {main}', '2026-07-12 13:59:27');
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (3, 'adc4403f-c8a8-43bc-b395-82ab4669801f', 'database', 'default', '{"uuid":"adc4403f-c8a8-43bc-b395-82ab4669801f","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":1:{s:8:\"lessonId\";i:11;}","batchId":null},"createdAt":1783864763,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\acer\Codes\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle()
#1 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#3 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#4 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#5 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call()
#6 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}()
#7 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#8 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then()
#9 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow()
#10 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}()
#11 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#12 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then()
#13 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware()
#14 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call()
#15 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process()
#17 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob()
#18 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob()
#19 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker()
#20 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#23 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#24 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#25 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call()
#26 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute()
#27 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run()
#28 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run()
#29 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand()
#30 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun()
#31 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run()
#32 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle()
#33 C:\Users\acer\Codes\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand()
#34 {main}', '2026-07-12 13:59:28');
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (4, '48099c75-8063-4ca3-a512-bb55e7b4a2fe', 'database', 'default', '{"uuid":"48099c75-8063-4ca3-a512-bb55e7b4a2fe","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":1:{s:8:\"lessonId\";i:12;}","batchId":null},"createdAt":1783864763,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\acer\Codes\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle()
#1 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#3 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#4 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#5 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call()
#6 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}()
#7 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#8 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then()
#9 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow()
#10 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}()
#11 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}()
#12 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then()
#13 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware()
#14 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call()
#15 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process()
#17 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob()
#18 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob()
#19 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker()
#20 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure()
#23 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod()
#24 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call()
#25 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call()
#26 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute()
#27 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run()
#28 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run()
#29 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand()
#30 C:\Users\acer\Codes\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun()
#31 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run()
#32 C:\Users\acer\Codes\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle()
#33 C:\Users\acer\Codes\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand()
#34 {main}', '2026-07-12 13:59:28');
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (5, 'f6c2c6b2-881b-4b23-ad9b-7b1e7c325dde', 'database', 'default', '{"uuid":"f6c2c6b2-881b-4b23-ad9b-7b1e7c325dde","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":2:{s:8:\"lessonId\";i:13;s:11:\"afterCommit\";b:1;}","batchId":null},"createdAt":1784344385,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\L4T\Desktop\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle(Object(App\Services\GeminiService))
#1 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure(Object(Closure))
#3 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod(Object(Illuminate\Foundation\Application), Array, Object(Closure))
#4 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call(Object(Illuminate\Foundation\Application), Array, Array, NULL)
#5 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call(Array)
#6 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#7 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#8 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then(Object(Closure))
#9 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow(Object(App\Jobs\WarmLessonAiFeedback), false)
#10 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#11 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#12 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then(Object(Closure))
#13 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\Queue\Jobs\DatabaseJob), Object(App\Jobs\WarmLessonAiFeedback))
#14 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call(Object(Illuminate\Queue\Jobs\DatabaseJob), Array)
#15 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process(''database'', Object(Illuminate\Queue\Jobs\DatabaseJob), Object(Illuminate\Queue\WorkerOptions))
#17 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob(Object(Illuminate\Queue\Jobs\DatabaseJob), ''database'', Object(Illuminate\Queue\WorkerOptions))
#18 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob(''database'', ''default'', Object(Illuminate\Queue\WorkerOptions))
#19 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker(''database'', ''default'')
#20 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure(Object(Closure))
#23 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod(Object(Illuminate\Foundation\Application), Array, Object(Closure))
#24 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call(Object(Illuminate\Foundation\Application), Array, Array, NULL)
#25 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call(Array)
#26 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute(Object(Symfony\Component\Console\Input\ArgvInput), Object(Illuminate\Console\OutputStyle))
#27 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Illuminate\Console\OutputStyle))
#28 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#29 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand(Object(Illuminate\Queue\Console\WorkCommand), Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#30 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#31 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#32 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#33 C:\Users\L4T\Desktop\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand(Object(Symfony\Component\Console\Input\ArgvInput))
#34 {main}', '2026-07-21 01:22:14');
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (6, '68d94492-c382-447b-bab3-430b3495e141', 'database', 'default', '{"uuid":"68d94492-c382-447b-bab3-430b3495e141","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":2:{s:8:\"lessonId\";i:13;s:11:\"afterCommit\";b:1;}","batchId":null},"createdAt":1784345521,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\L4T\Desktop\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle(Object(App\Services\GeminiService))
#1 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure(Object(Closure))
#3 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod(Object(Illuminate\Foundation\Application), Array, Object(Closure))
#4 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call(Object(Illuminate\Foundation\Application), Array, Array, NULL)
#5 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call(Array)
#6 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#7 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#8 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then(Object(Closure))
#9 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow(Object(App\Jobs\WarmLessonAiFeedback), false)
#10 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#11 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#12 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then(Object(Closure))
#13 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\Queue\Jobs\DatabaseJob), Object(App\Jobs\WarmLessonAiFeedback))
#14 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call(Object(Illuminate\Queue\Jobs\DatabaseJob), Array)
#15 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process(''database'', Object(Illuminate\Queue\Jobs\DatabaseJob), Object(Illuminate\Queue\WorkerOptions))
#17 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob(Object(Illuminate\Queue\Jobs\DatabaseJob), ''database'', Object(Illuminate\Queue\WorkerOptions))
#18 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob(''database'', ''default'', Object(Illuminate\Queue\WorkerOptions))
#19 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker(''database'', ''default'')
#20 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure(Object(Closure))
#23 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod(Object(Illuminate\Foundation\Application), Array, Object(Closure))
#24 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call(Object(Illuminate\Foundation\Application), Array, Array, NULL)
#25 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call(Array)
#26 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute(Object(Symfony\Component\Console\Input\ArgvInput), Object(Illuminate\Console\OutputStyle))
#27 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Illuminate\Console\OutputStyle))
#28 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#29 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand(Object(Illuminate\Queue\Console\WorkCommand), Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#30 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#31 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#32 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#33 C:\Users\L4T\Desktop\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand(Object(Symfony\Component\Console\Input\ArgvInput))
#34 {main}', '2026-07-21 01:22:17');
INSERT INTO `failed_jobs` (`id`, `uuid`, `connection`, `queue`, `payload`, `exception`, `failed_at`) VALUES (7, '0bad1ab4-3e24-49b8-83ee-74b0f2eadc57', 'database', 'default', '{"uuid":"0bad1ab4-3e24-49b8-83ee-74b0f2eadc57","displayName":"App\\Jobs\\WarmLessonAiFeedback","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":1,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":1200,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\WarmLessonAiFeedback","command":"O:29:\"App\\Jobs\\WarmLessonAiFeedback\":2:{s:8:\"lessonId\";i:13;s:11:\"afterCommit\";b:1;}","batchId":null},"createdAt":1784345771,"delay":null}', 'Error: Call to a member function whereNull() on null in C:\Users\L4T\Desktop\AI-IIMS\app\Jobs\WarmLessonAiFeedback.php:33
Stack trace:
#0 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): App\Jobs\WarmLessonAiFeedback->handle(Object(App\Services\GeminiService))
#1 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#2 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure(Object(Closure))
#3 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod(Object(Illuminate\Foundation\Application), Array, Object(Closure))
#4 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call(Object(Illuminate\Foundation\Application), Array, Array, NULL)
#5 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(136): Illuminate\Container\Container->call(Array)
#6 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Bus\Dispatcher->Illuminate\Bus\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#7 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#8 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Bus\Dispatcher.php(140): Illuminate\Pipeline\Pipeline->then(Object(Closure))
#9 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(153): Illuminate\Bus\Dispatcher->dispatchNow(Object(App\Jobs\WarmLessonAiFeedback), false)
#10 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(180): Illuminate\Queue\CallQueuedHandler->Illuminate\Queue\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#11 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Pipeline\Pipeline.php(137): Illuminate\Pipeline\Pipeline->Illuminate\Pipeline\{closure}(Object(App\Jobs\WarmLessonAiFeedback))
#12 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(146): Illuminate\Pipeline\Pipeline->then(Object(Closure))
#13 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\CallQueuedHandler.php(84): Illuminate\Queue\CallQueuedHandler->dispatchThroughMiddleware(Object(Illuminate\Queue\Jobs\DatabaseJob), Object(App\Jobs\WarmLessonAiFeedback))
#14 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Jobs\Job.php(102): Illuminate\Queue\CallQueuedHandler->call(Object(Illuminate\Queue\Jobs\DatabaseJob), Array)
#15 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(517): Illuminate\Queue\Jobs\Job->fire()
#16 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(463): Illuminate\Queue\Worker->process(''database'', Object(Illuminate\Queue\Jobs\DatabaseJob), Object(Illuminate\Queue\WorkerOptions))
#17 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Worker.php(384): Illuminate\Queue\Worker->runJob(Object(Illuminate\Queue\Jobs\DatabaseJob), ''database'', Object(Illuminate\Queue\WorkerOptions))
#18 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(148): Illuminate\Queue\Worker->runNextJob(''database'', ''default'', Object(Illuminate\Queue\WorkerOptions))
#19 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Queue\Console\WorkCommand.php(131): Illuminate\Queue\Console\WorkCommand->runWorker(''database'', ''default'')
#20 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(36): Illuminate\Queue\Console\WorkCommand->handle()
#21 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Util.php(43): Illuminate\Container\BoundMethod::Illuminate\Container\{closure}()
#22 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(96): Illuminate\Container\Util::unwrapIfClosure(Object(Closure))
#23 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\BoundMethod.php(35): Illuminate\Container\BoundMethod::callBoundMethod(Object(Illuminate\Foundation\Application), Array, Object(Closure))
#24 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Container\Container.php(799): Illuminate\Container\BoundMethod::call(Object(Illuminate\Foundation\Application), Array, Array, NULL)
#25 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(280): Illuminate\Container\Container->call(Array)
#26 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Command\Command.php(341): Illuminate\Console\Command->execute(Object(Symfony\Component\Console\Input\ArgvInput), Object(Illuminate\Console\OutputStyle))
#27 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Console\Command.php(249): Symfony\Component\Console\Command\Command->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Illuminate\Console\OutputStyle))
#28 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(1117): Illuminate\Console\Command->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#29 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(356): Symfony\Component\Console\Application->doRunCommand(Object(Illuminate\Queue\Console\WorkCommand), Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#30 C:\Users\L4T\Desktop\AI-IIMS\vendor\symfony\console\Application.php(195): Symfony\Component\Console\Application->doRun(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#31 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Console\Kernel.php(198): Symfony\Component\Console\Application->run(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#32 C:\Users\L4T\Desktop\AI-IIMS\vendor\laravel\framework\src\Illuminate\Foundation\Application.php(1235): Illuminate\Foundation\Console\Kernel->handle(Object(Symfony\Component\Console\Input\ArgvInput), Object(Symfony\Component\Console\Output\ConsoleOutput))
#33 C:\Users\L4T\Desktop\AI-IIMS\artisan(16): Illuminate\Foundation\Application->handleCommand(Object(Symfony\Component\Console\Input\ArgvInput))
#34 {main}', '2026-07-21 01:22:19');
COMMIT;
-- ----------------------------
-- Table structure for job_batches
-- ----------------------------
DROP TABLE IF EXISTS `job_batches`;
CREATE TABLE `job_batches` (
  `id` VARCHAR(255) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `total_jobs` BIGINT NOT NULL,
  `pending_jobs` BIGINT NOT NULL,
  `failed_jobs` BIGINT NOT NULL,
  `failed_job_ids` LONGTEXT NOT NULL,
  `options` LONGTEXT,
  `cancelled_at` BIGINT,
  `created_at` BIGINT NOT NULL,
  `finished_at` BIGINT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of job_batches
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for jobs
-- ----------------------------
DROP TABLE IF EXISTS `jobs`;
CREATE TABLE `jobs` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `queue` VARCHAR(255) NOT NULL,
  `payload` LONGTEXT NOT NULL,
  `attempts` BIGINT NOT NULL,
  `reserved_at` BIGINT,
  `available_at` BIGINT NOT NULL,
  `created_at` BIGINT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of jobs
-- ----------------------------
START TRANSACTION;
INSERT INTO `jobs` (`id`, `queue`, `payload`, `attempts`, `reserved_at`, `available_at`, `created_at`) VALUES (5, 'slides', '{"uuid":"320db91f-2a32-4caa-85a8-125bcca972f6","displayName":"App\\Jobs\\ConvertSlidesToImages","job":"Illuminate\\Queue\\CallQueuedHandler@call","maxTries":2,"maxExceptions":null,"failOnTimeout":false,"backoff":null,"timeout":300,"retryUntil":null,"deleteWhenMissingModels":false,"data":{"commandName":"App\\Jobs\\ConvertSlidesToImages","command":"O:30:\"App\\Jobs\\ConvertSlidesToImages\":2:{s:13:\"slideUploadId\";i:5;s:5:\"queue\";s:6:\"slides\";}","batchId":null},"createdAt":1783258335,"delay":null}', 0, NULL, 1783258335, 1783258335);
COMMIT;
-- ----------------------------
-- Table structure for lesson_activities
-- ----------------------------
DROP TABLE IF EXISTS `lesson_activities`;
CREATE TABLE `lesson_activities` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT NOT NULL,
  `lesson_section_id` BIGINT,
  `type` VARCHAR(255) NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `instruction` LONGTEXT,
  `payload` LONGTEXT,
  `correct_answer` LONGTEXT,
  `explanation` LONGTEXT,
  `record_score` BIGINT NOT NULL,
  `sort_order` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_activities_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `lesson_activities_lesson_section_id_foreign` FOREIGN KEY (`lesson_section_id`) REFERENCES `lesson_sections` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_activities
-- ----------------------------
START TRANSACTION;
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (75, 9, 65, 'mini_quiz', 'Quick Check', 'Identify the variable in the following equation.', '{"choices": ["3", "y", "-7", "14"], "question": "In the equation 3y - 7 = 14, what is the variable?"}', '"y"', 'The variable is the letter that represents an unknown value, which is ''y'' in this equation.', 1, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (76, 9, 66, 'mini_quiz', 'Inverse Operation Match', 'Match the operation with its inverse.', '{"choices": ["Addition", "Subtraction", "Multiplication", "Division"], "question": "What is the inverse operation of multiplication?"}', '"Division"', 'Division is the inverse operation of multiplication, meaning it undoes multiplication.', 1, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (77, 9, 67, 'mini_quiz', 'Solve It!', 'Solve the equation by using the correct inverse operation.', '{"choices": ["n = 10", "n = 40", "n = 5", "n = 20"], "question": "What is the value of ''n'' in the equation n + 15 = 25?"}', '"n = 10"', 'To isolate ''n'', subtract 15 from both sides: n + 15 - 15 = 25 - 15, so n = 10.', 1, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (78, 9, 68, 'mini_quiz', 'Solve It!', 'Solve the equation using the correct inverse operation.', '{"choices": ["k = 5", "k = 6", "k = 49", "k = 35"], "question": "What is the value of ''k'' in the equation 7k = 42?"}', '"k = 6"', 'To isolate ''k'', divide both sides by 7: 7k / 7 = 42 / 7, so k = 6.', 1, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (79, 9, NULL, 'reflection', 'Exit Reflection', 'Reflect on the lesson.', '{"prompt": "What is one strategy you will use to solve one-step equations in the future?"}', NULL, NULL, 0, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (115, 10, 97, 'mini_quiz', 'What is Photosynthesis?', 'Choose the best definition for photosynthesis.', '{"choices": ["Plants eating other plants for energy", "Plants making their own food using sunlight", "Animals breathing out carbon dioxide", "Water moving through plant roots"], "question": "What is photosynthesis?"}', '"Plants making their own food using sunlight"', 'Photosynthesis is the process plants use to create their own food (sugar) from sunlight, water, and carbon dioxide.', 1, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (116, 10, 98, 'reflection', 'Plant Food Ingredients', 'List one essential ingredient a plant needs for photosynthesis.', '{"prompt": "Name one thing a plant must have to perform photosynthesis."}', NULL, NULL, 0, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (117, 10, 99, 'mini_quiz', 'Chlorophyll''s Role', 'Identify the primary function of chlorophyll.', '{"choices": ["Water", "Chlorophyll", "Carbon Dioxide", "Roots"], "question": "What gives plants their green color and helps them capture sunlight for photosynthesis?"}', '"Chlorophyll"', 'Chlorophyll is the green pigment in plants that absorbs light energy, making it available for photosynthesis.', 1, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (118, 10, 100, 'reflection', 'What Plants Make', 'Name the two main products created by plants during photosynthesis.', '{"prompt": "What are the two most important things that plants produce as a result of photosynthesis?"}', NULL, NULL, 0, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (119, 10, NULL, 'reflection', 'Exit Reflection: Why Photosynthesis Matters', 'Reflect on what you''ve learned about photosynthesis and its importance.', '{"prompt": "Think about the process of photosynthesis. What is one new thing you learned today, and why is photosynthesis important for all living things on Earth?"}', NULL, NULL, 0, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (133, 8, 112, 'mini_quiz', 'Quick Check', 'Choose the best answer.', '{"choices": ["To create the most viral content", "To understand, evaluate, and use media and information effectively", "To memorize facts from news articles", "To only use information found on social media"], "question": "What is the main goal of Media and Information Literacy?"}', '"To understand, evaluate, and use media and information effectively"', 'MIL focuses on developing skills to critically engage with all forms of media and information.', 1, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (134, 8, 113, 'mini_quiz', 'Importance Check', 'Select all that apply.', '{"choices": ["Helps identify misinformation", "Improves decision-making", "Enables responsible creation of content", "Makes you popular on social media"], "question": "Which of the following are reasons why MIL is important?"}', '"Helps identify misinformation"', 'MIL equips you with skills to critically analyze media, make informed choices, and participate effectively.', 1, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (135, 8, 114, 'reflection', 'Concept Application', 'Type your answer.', '{"prompt": "Type your answer."}', NULL, 'This helps you distinguish between the content and the channel.', 0, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (136, 8, 115, 'mini_quiz', 'Critical Thinking Order', 'Drag and drop the steps into the correct order to become a critical media consumer.', '{"choices": ["Question the source and purpose", "Accept the information immediately", "Evaluate the credibility of the information", "Consider alternative perspectives"], "question": "What are the key steps to becoming a critical media consumer?"}', '"Question the source and purpose"', 'A critical consumer questions, evaluates, and considers multiple viewpoints, rather than accepting information at face value.', 1, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (137, 8, NULL, 'reflection', 'Exit Reflection', 'Take a moment to think about what you''ve learned.', '{"prompt": "What is one specific question you will start asking yourself when you encounter new information online?"}', NULL, NULL, 0, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (142, 12, 119, 'mini_quiz', 'Quick Check: Function Definition', 'Identify whether the relationship describes a function.', '{"choices": ["Yes, because it has inputs and outputs.", "No, because one input maps to multiple outputs.", "Yes, as long as 5 and 10 are real numbers.", "No, because inputs must always equal outputs."], "question": "If an input value of 3 produces two different output values, 5 and 10, is this relation a function?"}', '"No, because one input maps to multiple outputs."', 'By definition, a function can only assign exactly one output to each distinct input.', 1, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (143, 12, 120, 'mini_quiz', 'Quick Check: Slopes and Curves', 'Answer the question based on rate of change principles.', '{"choices": ["A curved line has a constant rate of change, while a straight line does not.", "A curved line has a changing rate of change, while a straight line has a constant rate of change.", "Neither line has a measurable rate of change.", "They both always share the same constant rate of change."], "question": "How does the rate of change of a curved line differ from the rate of change of a straight line?"}', '"A curved line has a changing rate of change, while a straight line has a constant rate of change."', 'A straight line has a fixed slope, whereas the steepness (slope) of a curve changes from point to point.', 1, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (144, 12, 121, 'mini_quiz', 'Quick Check: Why Limits?', 'Select the best explanation of a limit''s purpose.', '{"choices": ["Because plugging in the value directly can result in an undefined expression like 0/0.", "Because limits make the math more complicated on purpose.", "Because functions never have actual values at the target point.", "Because limits only work for linear equations."], "question": "Why do we use limits instead of simply plugging in the target value in some calculus problems?"}', '"Because plugging in the value directly can result in an undefined expression like 0/0."', 'Limits allow us to explore the behavior of a function near a point where the function itself might not be directly defined.', 1, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (145, 12, NULL, 'reflection', 'Exit Reflection', 'Reflect on how your algebra knowledge connects to Calculus.', '{"prompt": "In your own words, explain why transition from constant rates of change (algebra) to variable rates of change (calculus) requires us to think about intervals getting infinitely small."}', NULL, NULL, 0, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (150, 11, 126, 'mini_quiz', 'Word Power Check', 'Select the correct meaning of the word root.', '{"choices": ["Green", "Water", "Light", "To make"], "question": "What does the root word ''photo'' mean in photosynthesis?"}', '"Light"', '''Photo'' is the Greek root word for light. Plants use sunlight as their primary energy source to kickstart food-making.', 1, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (151, 11, 128, 'mini_quiz', 'Sourcing the Ingredients', 'Identify how plants collect their supplies.', '{"choices": ["Through the flowers", "From the soil through the roots", "By absorbing rain directly into the stems", "It is created inside the plant automatically"], "question": "How does water enter a plant for photosynthesis?"}', '"From the soil through the roots"', 'Roots act like straws, drawing up water and minerals from the soil and sending them up to the leaves.', 1, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (152, 11, 129, 'mini_quiz', 'The End Product', 'Choose the best answer based on the outputs of photosynthesis.', '{"choices": ["Glucose", "Sucrose", "Lactose", "Fructose"], "question": "What sugar do plants produce to use for energy and growth?"}', '"Glucose"', 'Glucose is the simple sugar that provides energy and food for the plant to thrive.', 1, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (153, 11, NULL, 'reflection', 'Connection Reflection', 'Think about how plants and humans help each other survive.', '{"prompt": "In your own words, explain how photosynthesis connects plants to human survival. What do plants give us, and what do we give back to them?"}', NULL, NULL, 0, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (162, 13, 136, 'mini_quiz', 'Match the Era', 'Identify the correct historical era for the given invention.', '{"question":"In which era was the printing press invented?","choices":["Pre-Industrial Age","Industrial Age","Electronic Age","Information Age"]}', '"Industrial Age"', 'The printing press using movable type was a hallmark of the Industrial Age, paving the way for mass production of text.', 1, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (163, 13, 137, 'mini_quiz', 'Democratization of Information', 'Answer based on the reading.', '{"question":"What is the main reason the printing press is considered revolutionary?","choices":["It made books more beautiful than hand-written ones.","It allowed information to be printed in multiple colors.","It lowered the cost of books and democratized access to knowledge.","It was the first electronic device ever created."]}', '"It lowered the cost of books and democratized access to knowledge."', 'By making books affordable and mass-produced, the printing press broke the monopoly on knowledge held by the elite.', 1, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (164, 13, 138, 'mini_quiz', 'Determinism Check', 'Distinguish between the two media theories.', '{"question":"If you believe that ''smartphones forced human beings to become more unsocial,'' which theory are you aligning with?","choices":["Technological Determinism","Cultural Determinism","Pre-Industrial Theory","Digital Literacy Theory"]}', '"Technological Determinism"', 'Technological determinism argues that the technology itself acts as the primary agent of change, shaping human behavior.', 1, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_activities` (`id`, `lesson_id`, `lesson_section_id`, `type`, `title`, `instruction`, `payload`, `correct_answer`, `explanation`, `record_score`, `sort_order`, `created_at`, `updated_at`) VALUES (165, 13, NULL, 'reflection', 'Imagine a Day in the Electronic Age', 'Think about how deeply integrated modern digital media is in your daily life.', '{"prompt":"Imagine waking up tomorrow in the year 1975 (the Electronic Age). You have television and landline phones, but no internet, no smartphones, and no social media. Describe how your daily routine, schoolwork, and communication with friends would change in 3-4 sentences."}', NULL, NULL, 0, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
COMMIT;
-- ----------------------------
-- Table structure for lesson_cue_points
-- ----------------------------
DROP TABLE IF EXISTS `lesson_cue_points`;
CREATE TABLE `lesson_cue_points` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_media_id` BIGINT NOT NULL,
  `timestamp_seconds` BIGINT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `question` LONGTEXT,
  `options` LONGTEXT,
  `correct_option` VARCHAR(255),
  `explanation` LONGTEXT,
  `content` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_cue_points_lesson_media_id_foreign` FOREIGN KEY (`lesson_media_id`) REFERENCES `lesson_media` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_cue_points
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for lesson_media
-- ----------------------------
DROP TABLE IF EXISTS `lesson_media`;
CREATE TABLE `lesson_media` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT NOT NULL,
  `lesson_section_id` BIGINT,
  `type` VARCHAR(255) NOT NULL,
  `url` LONGTEXT NOT NULL,
  `caption` VARCHAR(255),
  `sort_order` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_media_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `lesson_media_lesson_section_id_foreign` FOREIGN KEY (`lesson_section_id`) REFERENCES `lesson_sections` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_media
-- ----------------------------
START TRANSACTION;
INSERT INTO `lesson_media` (`id`, `lesson_id`, `lesson_section_id`, `type`, `url`, `caption`, `sort_order`, `created_at`, `updated_at`) VALUES (30, 8, 112, 'video', 'https://www.youtube.com/watch?v=cc5o2rxk4Vo', NULL, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_media` (`id`, `lesson_id`, `lesson_section_id`, `type`, `url`, `caption`, `sort_order`, `created_at`, `updated_at`) VALUES (31, 8, 113, 'link', 'https://unesdoc.unesco.org/ark:/48223/pf0000379227', 'UNESCO''s work on Media and Information Literacy', 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_media` (`id`, `lesson_id`, `lesson_section_id`, `type`, `url`, `caption`, `sort_order`, `created_at`, `updated_at`) VALUES (33, 12, 120, 'video', 'https://www.youtube.com/watch?v=WUvTyaaNkzM', 'Introduction to the Essence of Calculus', 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_media` (`id`, `lesson_id`, `lesson_section_id`, `type`, `url`, `caption`, `sort_order`, `created_at`, `updated_at`) VALUES (36, 13, 136, 'video', 'https://www.youtube.com/watch?v=vdXBwTlBdIc', 'Introduction to Media Literacy and its History', 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
COMMIT;
-- ----------------------------
-- Table structure for lesson_progress
-- ----------------------------
DROP TABLE IF EXISTS `lesson_progress`;
CREATE TABLE `lesson_progress` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_id` BIGINT NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `progress_percentage` BIGINT NOT NULL,
  `earned_score` DECIMAL(8,2) NOT NULL,
  `total_score` DECIMAL(8,2) NOT NULL,
  `score_percentage` DECIMAL(5,2),
  `scored_activities_count` BIGINT NOT NULL,
  `correct_activities_count` BIGINT NOT NULL,
  `started_at` LONGTEXT,
  `completed_at` LONGTEXT,
  `latest_scored_at` LONGTEXT,
  `time_spent_seconds` BIGINT NOT NULL,
  `last_activity_at` LONGTEXT,
  `last_video_position_seconds` BIGINT NOT NULL,
  `last_slide_index` BIGINT NOT NULL,
  `slides_completed` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_progress_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `lesson_progress_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_progress
-- ----------------------------
START TRANSACTION;
INSERT INTO `lesson_progress` (`id`, `student_id`, `lesson_id`, `status`, `progress_percentage`, `earned_score`, `total_score`, `score_percentage`, `scored_activities_count`, `correct_activities_count`, `started_at`, `completed_at`, `latest_scored_at`, `time_spent_seconds`, `last_activity_at`, `last_video_position_seconds`, `last_slide_index`, `slides_completed`, `created_at`, `updated_at`) VALUES (6, 1, 8, 'completed', 100, 0.00, 3.00, 0.00, 3, 0, '2026-06-29 03:36:25', '2026-07-13 02:40:22', '2026-07-08 02:46:00', 0, '2026-07-07 16:32:11', 0, 0, 0, '2026-06-29 03:36:25', '2026-07-13 02:40:22');
INSERT INTO `lesson_progress` (`id`, `student_id`, `lesson_id`, `status`, `progress_percentage`, `earned_score`, `total_score`, `score_percentage`, `scored_activities_count`, `correct_activities_count`, `started_at`, `completed_at`, `latest_scored_at`, `time_spent_seconds`, `last_activity_at`, `last_video_position_seconds`, `last_slide_index`, `slides_completed`, `created_at`, `updated_at`) VALUES (7, 1, 9, 'in_progress', 89, 2.00, 4.00, 50.00, 4, 2, '2026-07-01 12:55:04', NULL, '2026-07-05 13:50:55', 0, '2026-07-13 02:39:56', 0, 0, 0, '2026-07-01 12:55:04', '2026-07-13 02:39:56');
INSERT INTO `lesson_progress` (`id`, `student_id`, `lesson_id`, `status`, `progress_percentage`, `earned_score`, `total_score`, `score_percentage`, `scored_activities_count`, `correct_activities_count`, `started_at`, `completed_at`, `latest_scored_at`, `time_spent_seconds`, `last_activity_at`, `last_video_position_seconds`, `last_slide_index`, `slides_completed`, `created_at`, `updated_at`) VALUES (8, 1, 12, 'in_progress', 25, 0.00, 3.00, 0.00, 1, 0, '2026-07-07 02:56:04', NULL, '2026-07-08 14:40:42', 0, '2026-07-08 01:34:40', 9, 0, 0, '2026-07-07 02:56:04', '2026-07-08 14:40:42');
INSERT INTO `lesson_progress` (`id`, `student_id`, `lesson_id`, `status`, `progress_percentage`, `earned_score`, `total_score`, `score_percentage`, `scored_activities_count`, `correct_activities_count`, `started_at`, `completed_at`, `latest_scored_at`, `time_spent_seconds`, `last_activity_at`, `last_video_position_seconds`, `last_slide_index`, `slides_completed`, `created_at`, `updated_at`) VALUES (9, 1, 13, 'in_progress', 13, 0.00, 3.00, 0.00, 0, 0, '2026-07-18 03:16:37', NULL, NULL, 0, '2026-07-18 03:34:14', 30, 0, 0, '2026-07-18 03:16:37', '2026-07-18 03:34:14');
COMMIT;
-- ----------------------------
-- Table structure for lesson_questions
-- ----------------------------
DROP TABLE IF EXISTS `lesson_questions`;
CREATE TABLE `lesson_questions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT NOT NULL,
  `lesson_activity_id` BIGINT,
  `question_text` LONGTEXT NOT NULL,
  `option_a` VARCHAR(255) NOT NULL,
  `option_b` VARCHAR(255) NOT NULL,
  `option_c` VARCHAR(255) NOT NULL,
  `option_d` VARCHAR(255) NOT NULL,
  `correct_answer` VARCHAR(255) NOT NULL,
  `explanation` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_questions_lesson_activity_id_foreign` FOREIGN KEY (`lesson_activity_id`) REFERENCES `lesson_activities` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `lesson_questions_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_questions
-- ----------------------------
START TRANSACTION;
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (46, 9, 75, 'In the equation 3y - 7 = 14, what is the variable?', '3', 'y', '-7', '14', 'B', 'The variable is the letter that represents an unknown value, which is ''y'' in this equation.', '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (47, 9, 76, 'What is the inverse operation of multiplication?', 'Addition', 'Subtraction', 'Multiplication', 'Division', 'D', 'Division is the inverse operation of multiplication, meaning it undoes multiplication.', '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (48, 9, 77, 'What is the value of ''n'' in the equation n + 15 = 25?', 'n = 10', 'n = 40', 'n = 5', 'n = 20', 'A', 'To isolate ''n'', subtract 15 from both sides: n + 15 - 15 = 25 - 15, so n = 10.', '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (49, 9, 78, 'What is the value of ''k'' in the equation 7k = 42?', 'k = 5', 'k = 6', 'k = 49', 'k = 35', 'B', 'To isolate ''k'', divide both sides by 7: 7k / 7 = 42 / 7, so k = 6.', '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (71, 10, 115, 'What is photosynthesis?', 'Plants eating other plants for energy', 'Plants making their own food using sunlight', 'Animals breathing out carbon dioxide', 'Water moving through plant roots', 'B', 'Photosynthesis is the process plants use to create their own food (sugar) from sunlight, water, and carbon dioxide.', '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (72, 10, 117, 'What gives plants their green color and helps them capture sunlight for photosynthesis?', 'Water', 'Chlorophyll', 'Carbon Dioxide', 'Roots', 'B', 'Chlorophyll is the green pigment in plants that absorbs light energy, making it available for photosynthesis.', '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (82, 8, 133, 'What is the main goal of Media and Information Literacy?', 'To create the most viral content', 'To understand, evaluate, and use media and information effectively', 'To memorize facts from news articles', 'To only use information found on social media', 'B', 'MIL focuses on developing skills to critically engage with all forms of media and information.', '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (83, 8, 134, 'Which of the following are reasons why MIL is important?', 'Helps identify misinformation', 'Improves decision-making', 'Enables responsible creation of content', 'Makes you popular on social media', 'A', 'MIL equips you with skills to critically analyze media, make informed choices, and participate effectively.', '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (84, 8, 136, 'What are the key steps to becoming a critical media consumer?', 'Question the source and purpose', 'Accept the information immediately', 'Evaluate the credibility of the information', 'Consider alternative perspectives', 'A', 'A critical consumer questions, evaluates, and considers multiple viewpoints, rather than accepting information at face value.', '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (88, 12, 142, 'If an input value of 3 produces two different output values, 5 and 10, is this relation a function?', 'Yes, because it has inputs and outputs.', 'No, because one input maps to multiple outputs.', 'Yes, as long as 5 and 10 are real numbers.', 'No, because inputs must always equal outputs.', 'B', 'By definition, a function can only assign exactly one output to each distinct input.', '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (89, 12, 143, 'How does the rate of change of a curved line differ from the rate of change of a straight line?', 'A curved line has a constant rate of change, while a straight line does not.', 'A curved line has a changing rate of change, while a straight line has a constant rate of change.', 'Neither line has a measurable rate of change.', 'They both always share the same constant rate of change.', 'B', 'A straight line has a fixed slope, whereas the steepness (slope) of a curve changes from point to point.', '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (90, 12, 144, 'Why do we use limits instead of simply plugging in the target value in some calculus problems?', 'Because plugging in the value directly can result in an undefined expression like 0/0.', 'Because limits make the math more complicated on purpose.', 'Because functions never have actual values at the target point.', 'Because limits only work for linear equations.', 'A', 'Limits allow us to explore the behavior of a function near a point where the function itself might not be directly defined.', '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (94, 11, 150, 'What does the root word ''photo'' mean in photosynthesis?', 'Green', 'Water', 'Light', 'To make', 'C', '''Photo'' is the Greek root word for light. Plants use sunlight as their primary energy source to kickstart food-making.', '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (95, 11, 151, 'How does water enter a plant for photosynthesis?', 'Through the flowers', 'From the soil through the roots', 'By absorbing rain directly into the stems', 'It is created inside the plant automatically', 'B', 'Roots act like straws, drawing up water and minerals from the soil and sending them up to the leaves.', '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (96, 11, 152, 'What sugar do plants produce to use for energy and growth?', 'Glucose', 'Sucrose', 'Lactose', 'Fructose', 'A', 'Glucose is the simple sugar that provides energy and food for the plant to thrive.', '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (103, 13, 162, 'In which era was the printing press invented?', 'Pre-Industrial Age', 'Industrial Age', 'Electronic Age', 'Information Age', 'B', 'The printing press using movable type was a hallmark of the Industrial Age, paving the way for mass production of text.', '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (104, 13, 163, 'What is the main reason the printing press is considered revolutionary?', 'It made books more beautiful than hand-written ones.', 'It allowed information to be printed in multiple colors.', 'It lowered the cost of books and democratized access to knowledge.', 'It was the first electronic device ever created.', 'C', 'By making books affordable and mass-produced, the printing press broke the monopoly on knowledge held by the elite.', '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_questions` (`id`, `lesson_id`, `lesson_activity_id`, `question_text`, `option_a`, `option_b`, `option_c`, `option_d`, `correct_answer`, `explanation`, `created_at`, `updated_at`) VALUES (105, 13, 164, 'If you believe that ''smartphones forced human beings to become more unsocial,'' which theory are you aligning with?', 'Technological Determinism', 'Cultural Determinism', 'Pre-Industrial Theory', 'Digital Literacy Theory', 'A', 'Technological determinism argues that the technology itself acts as the primary agent of change, shaping human behavior.', '2026-07-18 03:36:11', '2026-07-18 03:36:11');
COMMIT;
-- ----------------------------
-- Table structure for lesson_sections
-- ----------------------------
DROP TABLE IF EXISTS `lesson_sections`;
CREATE TABLE `lesson_sections` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT NOT NULL,
  `title` VARCHAR(255) NOT NULL,
  `content` LONGTEXT,
  `content_type` VARCHAR(20) NOT NULL,
  `sort_order` BIGINT NOT NULL,
  `is_collapsible` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_sections_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_sections
-- ----------------------------
START TRANSACTION;
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (65, 9, 'What is an Equation?', '<p>An equation is like a balanced scale. It has two sides that are equal. Our goal when solving an equation is to find the value of the unknown variable (usually represented by a letter like ''x'') that makes both sides of the equation equal. Think of it as finding out what number needs to go in the blank to make the statement true.</p><p>For example, in the equation 5 + x = 10, we want to find the value of ''x'' that makes the equation true. We know that 5 + 5 = 10, so in this case, x = 5.</p>', 'text', 1, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (66, 9, 'Inverse Operations: The Key to Solving', '<p>To solve equations, we use inverse operations. Inverse operations are operations that ''undo'' each other. Addition and subtraction are inverse operations, and multiplication and division are inverse operations. </p><p>For example, if you add 5 to a number, you can subtract 5 to get back to the original number. If you multiply a number by 2, you can divide by 2 to get back to the original number. We use these inverse operations to isolate the variable on one side of the equation.</p>', 'text', 2, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (67, 9, 'Solving with Addition and Subtraction', '<p>To solve equations involving addition or subtraction, we use the opposite operation. If a number is being added to the variable, we subtract that number from both sides of the equation. If a number is being subtracted from the variable, we add that number to both sides.</p><p>Example: Solve for x in x + 7 = 12. Since 7 is added to x, we subtract 7 from both sides: x + 7 - 7 = 12 - 7, which simplifies to x = 5.</p><p>Example: Solve for y in y - 3 = 9. Since 3 is subtracted from y, we add 3 to both sides: y - 3 + 3 = 9 + 3, which simplifies to y = 12.</p>', 'text', 3, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (68, 9, 'Solving with Multiplication and Division', '<p>Similarly, to solve equations involving multiplication or division, we use the inverse operations. If the variable is being multiplied by a number, we divide both sides by that number. If the variable is being divided by a number, we multiply both sides by that number.</p><p>Example: Solve for p in 4p = 20. Since p is multiplied by 4, we divide both sides by 4: 4p / 4 = 20 / 4, which simplifies to p = 5.</p><p>Example: Solve for m in m / 3 = 6. Since m is divided by 3, we multiply both sides by 3: (m / 3) * 3 = 6 * 3, which simplifies to m = 18.</p>', 'text', 4, 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (97, 10, 'Introduction to Photosynthesis', '<p>Plants are amazing! Unlike humans, they don''t need to eat other living things to get energy. Instead, they make their own food through a special process called photosynthesis. This word means "making with light." It''s how plants transform sunlight into the energy they need to grow and thrive.</p>', 'text', 1, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (98, 10, 'The Essential Ingredients', '<p>Just like you need ingredients to bake a cake, plants need a few key things to make their food. They need sunlight, which gives them energy. They also need water, which they absorb through their roots, and carbon dioxide, a gas they take from the air through tiny pores in their leaves.</p><p>These three ingredients are crucial for the plant''s food-making process. Without any one of them, photosynthesis cannot happen effectively.</p>', 'text', 2, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (99, 10, 'The Green Powerhouse: Chlorophyll', '<p>Have you ever wondered why most plants are green? It''s because of a special pigment called chlorophyll! Chlorophyll is found inside tiny parts of plant cells called chloroplasts. Chlorophyll''s job is to capture the energy from sunlight, which is crucial for the photosynthesis process to happen.</p><p>Think of chlorophyll as a tiny solar panel within the plant, absorbing light energy and making it available for the plant to convert raw materials into food.</p>', 'text', 3, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (100, 10, 'The Products of Photosynthesis', '<p>Once plants have collected sunlight, water, and carbon dioxide, they use these ingredients to create two very important things. First, they produce glucose, which is a type of sugar that serves as the plant''s food and energy source. This glucose helps the plant grow, flower, and produce fruit.</p><p>Second, they release oxygen into the air as a byproduct. This oxygen is essential for animals and humans to breathe! So, photosynthesis not only feeds plants but also provides us with the air we need to live.</p>', 'text', 4, 1, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (112, 8, 'What is Media and Information Literacy?', '<p>Welcome to the world of Media and Information Literacy (MIL)! In today''s fast-paced digital age, we are constantly surrounded by information from various sources – social media, news websites, videos, podcasts, and more. MIL helps us navigate this complex landscape by teaching us how to find, understand, evaluate, use, and create media and information responsibly and effectively.</p><p>Think of MIL as a set of superpowers for your brain. It''s not just about knowing how to use technology; it''s about developing critical thinking skills to question the information you encounter. This helps you become a more informed citizen, a more discerning consumer of media, and a more responsible creator of content.</p>', 'text', 1, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (113, 8, 'Why is MIL Important?', '<p>MIL is crucial because it empowers you. With so much information available, it''s easy to be misled by misinformation or disinformation. Understanding how media messages are constructed and distributed helps you identify potential biases, inaccuracies, or hidden agendas.</p><p>Being media and information literate also allows you to participate more fully in society. You can make better decisions, engage in informed discussions, and contribute constructively to your community and the world. It''s a vital skill for both personal growth and active citizenship.</p>', 'text', 2, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (114, 8, 'Key Concepts: Information vs. Media', '<p>It''s helpful to understand the difference between ''information'' and ''media''. <strong>Information</strong> is knowledge or data about something. It can be facts, figures, news, or ideas. <strong>Media</strong>, on the other hand, refers to the channels or tools we use to communicate and share information. Examples include newspapers, television, radio, websites, social media platforms, and even books.</p><p>MIL looks at both. We examine the information itself – its accuracy, its source, its purpose – and we examine the media through which it is delivered – how it''s presented, who controls it, and its potential impact.</p>', 'text', 3, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (115, 8, 'Becoming a Critical Consumer', '<p>Being a critical consumer of media means you don''t just passively accept what you see or read. You actively question it. Ask yourself: Who created this message? What is their purpose? What techniques are they using to grab my attention? Is this information credible? Is there another side to this story?</p><p>Developing these habits of mind will help you avoid being manipulated and ensure you are basing your understanding of the world on reliable sources. It’s about being an active participant in your own learning and understanding.</p>', 'text', 4, 1, '2026-07-08 02:27:54', '2026-07-08 02:27:54');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (119, 12, 'What is a Function?', '<div data-lesson-slides="true">
<section data-lesson-slide="true" data-slide-index="1">
<h3>asdasd</h3>
<p>asdasdasd</p>
</section>
<section data-lesson-slide="true" data-slide-index="2">
<h3>dasdada</h3>
<p>daasdasdasdas</p>
</section></div>', 'slides', 1, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (120, 12, 'Rates of Change: Constant vs. Variable', '<p>In algebra, you studied lines with a constant rate of change, which we call the slope. For any two points on a line, the ratio of the vertical change to the horizontal change (rise over run) is always identical.</p><p>However, the real world is rarely linear. Cars accelerate, populations grow exponentially, and falling objects speed up over time. In calculus, we study curves where the rate of change is constantly shifting. To prepare for this, we must learn to calculate average rates of change over smaller and smaller intervals.</p>', 'text', 2, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (121, 12, 'Introduction to the Limit Concept', '<p>Imagine trying to calculate the speed of a falling object at one exact instant (say, exactly 2 seconds into its fall). If you try to use the algebra slope formula, the time interval is zero. Dividing by zero is undefined, leaving us stuck.</p><p>This is where the concept of a <strong>limit</strong> comes in. A limit allows us to investigate what value a function is approaching as the input gets closer and closer to a target number, without actually arriving there. It bridges the gap between static algebra and dynamic calculus.</p>', 'text', 3, 1, '2026-07-08 13:26:02', '2026-07-08 13:26:02');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (126, 11, 'What is Photosynthesis?', '<p>Have you ever wondered how plants eat? Unlike humans, plants don''t go to the grocery store. Instead, they make their own food using a special process called <strong>photosynthesis</strong>.</p><p>The word photosynthesis comes from Greek: ''photo'' means light, and ''synthesis'' means putting together. So, plants literally use light to put things together and make their food!</p>', 'text', 1, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (127, 11, 'The Green Kitchen: Chloroplasts', '<p>Where does all this chemical cooking happen? It takes place inside microscopic rooms in the plant''s cells called <strong>chloroplasts</strong>.</p><p>Chloroplasts contain a special green pigment called <strong>chlorophyll</strong>. Chlorophyll acts like a tiny solar panel, capturing the sunlight needed to power the entire process. This green pigment is also the reason most plant leaves look green to us!</p>', 'text', 2, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (128, 11, 'The Three Ingredients', '<p>To bake a cake, you need ingredients. To make food, plants need three main ingredients: <strong>sunlight</strong>, <strong>water</strong>, and <strong>carbon dioxide</strong>.</p><p>Water is absorbed by the roots from the soil. Carbon dioxide is a gas that plants absorb from the air through tiny microscopic holes in their leaves. Sunlight is captured by the green parts of the plant''s leaves.</p>', 'text', 3, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (129, 11, 'The Delicious Results', '<p>Once the plant mixes sunlight, water, and carbon dioxide together, it creates two brand new things: <strong>glucose</strong> and <strong>oxygen</strong>.</p><p>Glucose is a type of sugar that the plant uses as food to grow big and strong. Oxygen is a gas that the plant doesn''t need, so it releases it back into the air. This is the very same oxygen that humans and animals breathe to survive!</p>', 'text', 4, 1, '2026-07-12 13:40:31', '2026-07-12 13:40:31');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (136, 13, 'The Four Eras of Media', '<div data-lesson-slides="true"><section data-lesson-slide="true" data-slide-index="1"><h3>Pre-Industrial Age (Before 1700s)</h3><p>People discovered fire, developed paper from plants, and forged weapons and tools with stone, bronze, copper, and iron. Communication was oral or recorded on cave walls and clay tablets.</p></section><section data-lesson-slide="true" data-slide-index="2"><h3>Industrial Age (1700s-1930s)</h3><p>The invention of the steam engine led to mass production. Newspapers, books, and the telegraph allowed information to travel faster and reach wider audiences than ever before.</p></section><section data-lesson-slide="true" data-slide-index="3"><h3>Electronic Age (1930s-1980s)</h3><p>The invention of the transistor ushered in the electronic age. Radio, television, and early computers made long-distance, real-time audio and visual communication a daily reality.</p></section><section data-lesson-slide="true" data-slide-index="4"><h3>Information Age (1990s-Present)</h3><p>Also known as the Digital Age. The internet, personal computers, and mobile phones democratized content creation, making everyone both a consumer and a publisher of media.</p></section></div>', 'slides', 1, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (137, 13, 'The Power of the Printing Press', '<p>Before Johannes Gutenberg invented the printing press in the 15th century, books were hand-copied by scribes, making them rare and expensive. Only the wealthy and powerful had access to information, which allowed them to control public knowledge.</p><p>The printing press changed everything. It allowed ideas to be copied rapidly and distributed widely. This democratization of information fueled the Scientific Revolution, the Reformation, and the rise of public education, proving that changing the medium of communication can transform entire civilizations.</p>', 'text', 2, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
INSERT INTO `lesson_sections` (`id`, `lesson_id`, `title`, `content`, `content_type`, `sort_order`, `is_collapsible`, `created_at`, `updated_at`) VALUES (138, 13, 'Technological vs. Cultural Determinism', '<p>How do media and technology shape our society? Scholars look at this through two major lenses. <strong>Technological Determinism</strong> is the theory that technology drives the development of social structure and cultural values. In this view, the invention of the internet directly caused our short attention spans and globalized economy.</p><p>On the other hand, <strong>Cultural Determinism</strong> (or social constructionism) argues that human actions and cultural desires drive how technology is developed and used. From this perspective, society wanted faster, more collaborative communication, which led us to invent the internet.</p>', 'text', 3, 1, '2026-07-18 03:36:11', '2026-07-18 03:36:11');
COMMIT;
-- ----------------------------
-- Table structure for lesson_slides
-- ----------------------------
DROP TABLE IF EXISTS `lesson_slides`;
CREATE TABLE `lesson_slides` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `image_path` VARCHAR(255),
  `block_data` LONGTEXT,
  `order` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lesson_slides_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lesson_slides
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for lessons
-- ----------------------------
DROP TABLE IF EXISTS `lessons`;
CREATE TABLE `lessons` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `teacher_id` BIGINT,
  `title` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255),
  `grade_level` BIGINT NOT NULL,
  `topic` VARCHAR(255),
  `content` LONGTEXT,
  `ilaw_intentions` LONGTEXT,
  `ilaw_learning_experience` LONGTEXT,
  `ilaw_assessing_learning` LONGTEXT,
  `ilaw_ways_forward` LONGTEXT,
  `questions` LONGTEXT,
  `objectives` LONGTEXT,
  `activities` LONGTEXT,
  `image_prompt` LONGTEXT,
  `video_prompt` LONGTEXT,
  `ai_suggestions` LONGTEXT,
  `difficulty_level` VARCHAR(255) NOT NULL,
  `is_published` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `lessons_teacher_id_foreign` FOREIGN KEY (`teacher_id`) REFERENCES `teachers` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of lessons
-- ----------------------------
START TRANSACTION;
INSERT INTO `lessons` (`id`, `teacher_id`, `title`, `subject`, `grade_level`, `topic`, `content`, `ilaw_intentions`, `ilaw_learning_experience`, `ilaw_assessing_learning`, `ilaw_ways_forward`, `questions`, `objectives`, `activities`, `image_prompt`, `video_prompt`, `ai_suggestions`, `difficulty_level`, `is_published`, `created_at`, `updated_at`) VALUES (8, 1, 'Introduction to Media and Information Literacy', 'Media and Information Literacy', 11, 'Introduction', 'What is Media and Information Literacy?
<p>Welcome to the world of Media and Information Literacy (MIL)! In today''s fast-paced digital age, we are constantly surrounded by information from various sources – social media, news websites, videos, podcasts, and more. MIL helps us navigate this complex landscape by teaching us how to find, understand, evaluate, use, and create media and information responsibly and effectively.</p><p>Think of MIL as a set of superpowers for your brain. It''s not just about knowing how to use technology; it''s about developing critical thinking skills to question the information you encounter. This helps you become a more informed citizen, a more discerning consumer of media, and a more responsible creator of content.</p>

Why is MIL Important?
<p>MIL is crucial because it empowers you. With so much information available, it''s easy to be misled by misinformation or disinformation. Understanding how media messages are constructed and distributed helps you identify potential biases, inaccuracies, or hidden agendas.</p><p>Being media and information literate also allows you to participate more fully in society. You can make better decisions, engage in informed discussions, and contribute constructively to your community and the world. It''s a vital skill for both personal growth and active citizenship.</p>

Key Concepts: Information vs. Media
<p>It''s helpful to understand the difference between ''information'' and ''media''. <strong>Information</strong> is knowledge or data about something. It can be facts, figures, news, or ideas. <strong>Media</strong>, on the other hand, refers to the channels or tools we use to communicate and share information. Examples include newspapers, television, radio, websites, social media platforms, and even books.</p><p>MIL looks at both. We examine the information itself – its accuracy, its source, its purpose – and we examine the media through which it is delivered – how it''s presented, who controls it, and its potential impact.</p>

Becoming a Critical Consumer
<p>Being a critical consumer of media means you don''t just passively accept what you see or read. You actively question it. Ask yourself: Who created this message? What is their purpose? What techniques are they using to grab my attention? Is this information credible? Is there another side to this story?</p><p>Developing these habits of mind will help you avoid being manipulated and ensure you are basing your understanding of the world on reliable sources. It’s about being an active participant in your own learning and understanding.</p>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', 1, '2026-06-29 03:35:30', '2026-07-03 12:49:04');
INSERT INTO `lessons` (`id`, `teacher_id`, `title`, `subject`, `grade_level`, `topic`, `content`, `ilaw_intentions`, `ilaw_learning_experience`, `ilaw_assessing_learning`, `ilaw_ways_forward`, `questions`, `objectives`, `activities`, `image_prompt`, `video_prompt`, `ai_suggestions`, `difficulty_level`, `is_published`, `created_at`, `updated_at`) VALUES (9, 1, 'Introduction to Solving One-Step Equations', 'Algebra', 11, 'Solving Equations', 'What is an Equation?
<p>An equation is like a balanced scale. It has two sides that are equal. Our goal when solving an equation is to find the value of the unknown variable (usually represented by a letter like ''x'') that makes both sides of the equation equal. Think of it as finding out what number needs to go in the blank to make the statement true.</p><p>For example, in the equation 5 + x = 10, we want to find the value of ''x'' that makes the equation true. We know that 5 + 5 = 10, so in this case, x = 5.</p>

Inverse Operations: The Key to Solving
<p>To solve equations, we use inverse operations. Inverse operations are operations that ''undo'' each other. Addition and subtraction are inverse operations, and multiplication and division are inverse operations. </p><p>For example, if you add 5 to a number, you can subtract 5 to get back to the original number. If you multiply a number by 2, you can divide by 2 to get back to the original number. We use these inverse operations to isolate the variable on one side of the equation.</p>

Solving with Addition and Subtraction
<p>To solve equations involving addition or subtraction, we use the opposite operation. If a number is being added to the variable, we subtract that number from both sides of the equation. If a number is being subtracted from the variable, we add that number to both sides.</p><p>Example: Solve for x in x + 7 = 12. Since 7 is added to x, we subtract 7 from both sides: x + 7 - 7 = 12 - 7, which simplifies to x = 5.</p><p>Example: Solve for y in y - 3 = 9. Since 3 is subtracted from y, we add 3 to both sides: y - 3 + 3 = 9 + 3, which simplifies to y = 12.</p>

Solving with Multiplication and Division
<p>Similarly, to solve equations involving multiplication or division, we use the inverse operations. If the variable is being multiplied by a number, we divide both sides by that number. If the variable is being divided by a number, we multiply both sides by that number.</p><p>Example: Solve for p in 4p = 20. Since p is multiplied by 4, we divide both sides by 4: 4p / 4 = 20 / 4, which simplifies to p = 5.</p><p>Example: Solve for m in m / 3 = 6. Since m is divided by 3, we multiply both sides by 3: (m / 3) * 3 = 6 * 3, which simplifies to m = 18.</p>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', 1, '2026-07-01 12:53:38', '2026-07-01 12:53:38');
INSERT INTO `lessons` (`id`, `teacher_id`, `title`, `subject`, `grade_level`, `topic`, `content`, `ilaw_intentions`, `ilaw_learning_experience`, `ilaw_assessing_learning`, `ilaw_ways_forward`, `questions`, `objectives`, `activities`, `image_prompt`, `video_prompt`, `ai_suggestions`, `difficulty_level`, `is_published`, `created_at`, `updated_at`) VALUES (10, 1, 'Photosynthesis and Plant Energy', 'Science', 11, 'Photosynthesis', 'Introduction to Photosynthesis
<p>Plants are amazing! Unlike humans, they don''t need to eat other living things to get energy. Instead, they make their own food through a special process called photosynthesis. This word means "making with light." It''s how plants transform sunlight into the energy they need to grow and thrive.</p>

The Essential Ingredients
<p>Just like you need ingredients to bake a cake, plants need a few key things to make their food. They need sunlight, which gives them energy. They also need water, which they absorb through their roots, and carbon dioxide, a gas they take from the air through tiny pores in their leaves.</p><p>These three ingredients are crucial for the plant''s food-making process. Without any one of them, photosynthesis cannot happen effectively.</p>

The Green Powerhouse: Chlorophyll
<p>Have you ever wondered why most plants are green? It''s because of a special pigment called chlorophyll! Chlorophyll is found inside tiny parts of plant cells called chloroplasts. Chlorophyll''s job is to capture the energy from sunlight, which is crucial for the photosynthesis process to happen.</p><p>Think of chlorophyll as a tiny solar panel within the plant, absorbing light energy and making it available for the plant to convert raw materials into food.</p>

The Products of Photosynthesis
<p>Once plants have collected sunlight, water, and carbon dioxide, they use these ingredients to create two very important things. First, they produce glucose, which is a type of sugar that serves as the plant''s food and energy source. This glucose helps the plant grow, flower, and produce fruit.</p><p>Second, they release oxygen into the air as a byproduct. This oxygen is essential for animals and humans to breathe! So, photosynthesis not only feeds plants but also provides us with the air we need to live.</p>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', 0, '2026-07-05 14:09:18', '2026-07-05 14:09:18');
INSERT INTO `lessons` (`id`, `teacher_id`, `title`, `subject`, `grade_level`, `topic`, `content`, `ilaw_intentions`, `ilaw_learning_experience`, `ilaw_assessing_learning`, `ilaw_ways_forward`, `questions`, `objectives`, `activities`, `image_prompt`, `video_prompt`, `ai_suggestions`, `difficulty_level`, `is_published`, `created_at`, `updated_at`) VALUES (11, 1, 'Photosynthesis: How Plants Make Food', 'Science', 11, 'Photosynthesis', 'What is Photosynthesis?
<p>Have you ever wondered how plants eat? Unlike humans, plants don''t go to the grocery store. Instead, they make their own food using a special process called <strong>photosynthesis</strong>.</p><p>The word photosynthesis comes from Greek: ''photo'' means light, and ''synthesis'' means putting together. So, plants literally use light to put things together and make their food!</p>

The Green Kitchen: Chloroplasts
<p>Where does all this chemical cooking happen? It takes place inside microscopic rooms in the plant''s cells called <strong>chloroplasts</strong>.</p><p>Chloroplasts contain a special green pigment called <strong>chlorophyll</strong>. Chlorophyll acts like a tiny solar panel, capturing the sunlight needed to power the entire process. This green pigment is also the reason most plant leaves look green to us!</p>

The Three Ingredients
<p>To bake a cake, you need ingredients. To make food, plants need three main ingredients: <strong>sunlight</strong>, <strong>water</strong>, and <strong>carbon dioxide</strong>.</p><p>Water is absorbed by the roots from the soil. Carbon dioxide is a gas that plants absorb from the air through tiny microscopic holes in their leaves. Sunlight is captured by the green parts of the plant''s leaves.</p>

The Delicious Results
<p>Once the plant mixes sunlight, water, and carbon dioxide together, it creates two brand new things: <strong>glucose</strong> and <strong>oxygen</strong>.</p><p>Glucose is a type of sugar that the plant uses as food to grow big and strong. Oxygen is a gas that the plant doesn''t need, so it releases it back into the air. This is the very same oxygen that humans and animals breathe to survive!</p>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', 1, '2026-07-05 14:15:03', '2026-07-12 13:40:08');
INSERT INTO `lessons` (`id`, `teacher_id`, `title`, `subject`, `grade_level`, `topic`, `content`, `ilaw_intentions`, `ilaw_learning_experience`, `ilaw_assessing_learning`, `ilaw_ways_forward`, `questions`, `objectives`, `activities`, `image_prompt`, `video_prompt`, `ai_suggestions`, `difficulty_level`, `is_published`, `created_at`, `updated_at`) VALUES (12, 1, 'Preparing for Calculus: Functions and Rates of Change', 'Calculus', 11, 'Pre-calculus', 'What is a Function?
<div data-lesson-slides="true">
<section data-lesson-slide="true" data-slide-index="1">
<h3>asdasd</h3>
<p>asdasdasd</p>
</section>
<section data-lesson-slide="true" data-slide-index="2">
<h3>dasdada</h3>
<p>daasdasdasdas</p>
</section></div>

Rates of Change: Constant vs. Variable
<p>In algebra, you studied lines with a constant rate of change, which we call the slope. For any two points on a line, the ratio of the vertical change to the horizontal change (rise over run) is always identical.</p><p>However, the real world is rarely linear. Cars accelerate, populations grow exponentially, and falling objects speed up over time. In calculus, we study curves where the rate of change is constantly shifting. To prepare for this, we must learn to calculate average rates of change over smaller and smaller intervals.</p>

Introduction to the Limit Concept
<p>Imagine trying to calculate the speed of a falling object at one exact instant (say, exactly 2 seconds into its fall). If you try to use the algebra slope formula, the time interval is zero. Dividing by zero is undefined, leaving us stuck.</p><p>This is where the concept of a <strong>limit</strong> comes in. A limit allows us to investigate what value a function is approaching as the input gets closer and closer to a target number, without actually arriving there. It bridges the gap between static algebra and dynamic calculus.</p>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', 1, '2026-07-07 02:54:29', '2026-07-08 13:26:02');
INSERT INTO `lessons` (`id`, `teacher_id`, `title`, `subject`, `grade_level`, `topic`, `content`, `ilaw_intentions`, `ilaw_learning_experience`, `ilaw_assessing_learning`, `ilaw_ways_forward`, `questions`, `objectives`, `activities`, `image_prompt`, `video_prompt`, `ai_suggestions`, `difficulty_level`, `is_published`, `created_at`, `updated_at`) VALUES (13, 1, 'Week 2: Evolution of Media', 'Media and Information Literacy', 11, 'Evolution of Media', 'The Four Eras of Media
<div data-lesson-slides="true"><section data-lesson-slide="true" data-slide-index="1"><h3>Pre-Industrial Age (Before 1700s)</h3><p>People discovered fire, developed paper from plants, and forged weapons and tools with stone, bronze, copper, and iron. Communication was oral or recorded on cave walls and clay tablets.</p></section><section data-lesson-slide="true" data-slide-index="2"><h3>Industrial Age (1700s-1930s)</h3><p>The invention of the steam engine led to mass production. Newspapers, books, and the telegraph allowed information to travel faster and reach wider audiences than ever before.</p></section><section data-lesson-slide="true" data-slide-index="3"><h3>Electronic Age (1930s-1980s)</h3><p>The invention of the transistor ushered in the electronic age. Radio, television, and early computers made long-distance, real-time audio and visual communication a daily reality.</p></section><section data-lesson-slide="true" data-slide-index="4"><h3>Information Age (1990s-Present)</h3><p>Also known as the Digital Age. The internet, personal computers, and mobile phones democratized content creation, making everyone both a consumer and a publisher of media.</p></section></div>

The Power of the Printing Press
<p>Before Johannes Gutenberg invented the printing press in the 15th century, books were hand-copied by scribes, making them rare and expensive. Only the wealthy and powerful had access to information, which allowed them to control public knowledge.</p><p>The printing press changed everything. It allowed ideas to be copied rapidly and distributed widely. This democratization of information fueled the Scientific Revolution, the Reformation, and the rise of public education, proving that changing the medium of communication can transform entire civilizations.</p>

Technological vs. Cultural Determinism
<p>How do media and technology shape our society? Scholars look at this through two major lenses. <strong>Technological Determinism</strong> is the theory that technology drives the development of social structure and cultural values. In this view, the invention of the internet directly caused our short attention spans and globalized economy.</p><p>On the other hand, <strong>Cultural Determinism</strong> (or social constructionism) argues that human actions and cultural desires drive how technology is developed and used. From this perspective, society wanted faster, more collaborative communication, which led us to invent the internet.</p>', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'beginner', 1, '2026-07-18 03:12:57', '2026-07-18 03:12:57');
COMMIT;
-- ----------------------------
-- Table structure for migrations
-- ----------------------------
DROP TABLE IF EXISTS `migrations`;
CREATE TABLE `migrations` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `migration` VARCHAR(255) NOT NULL,
  `batch` BIGINT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of migrations
-- ----------------------------
START TRANSACTION;
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (1, '0001_01_01_000000_create_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (2, '0001_01_01_000001_create_cache_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (3, '0001_01_01_000002_create_jobs_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (4, '2025_08_14_170933_add_two_factor_columns_to_users_table', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (5, '2026_05_13_102551_create_permission_tables', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (6, '2026_05_13_153505_students', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (7, '2026_05_13_154226_teachers', 1);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (8, '2026_05_14_101809_create_lessons_table', 2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (9, '2026_05_14_101815_create_lesson_progress_table', 2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (10, '2026_05_14_101822_create_test_attempts_table', 2);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (11, '2026_05_15_000000_create_lesson_questions_table', 3);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (12, '2026_05_15_010000_add_ai_enrichment_fields_to_lessons_table', 4);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (13, '2026_05_17_000000_create_lesson_builder_tables', 5);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (14, '2026_05_23_000000_create_assessment_test_tables', 6);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (15, '2026_05_23_010000_expand_lesson_activities_for_interactive_types', 7);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (16, '2026_05_24_000000_add_lesson_section_id_to_lesson_activities', 8);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (17, '2026_06_16_000001_add_lesson_section_id_to_lesson_media', 9);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (18, '2026_06_18_000000_add_scores_to_lesson_progress_table', 10);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (19, '2026_06_18_010000_add_record_score_to_lesson_activities_table', 11);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (20, '2026_06_18_020000_create_surveys_tables', 12);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (21, '2026_06_19_015155_add_time_spent_to_lesson_progress_table', 13);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (22, '2026_06_21_000000_create_notifications_table', 14);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (23, '2026_06_22_000000_add_ilaw_lrmds_columns_to_lessons_table', 15);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (24, '2026_07_01_000000_add_slides_type_to_lesson_media', 16);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (25, '2026_07_03_000001_create_lesson_cue_points_table', 17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (26, '2026_07_03_000002_create_student_cue_responses_table', 17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (27, '2026_07_03_000003_add_last_video_position_to_lesson_progress_table', 17);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (28, '2026_07_04_000001_create_slide_module_tables', 18);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (29, '2026_07_04_000002_add_slide_progress_to_lesson_progress_table', 18);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (30, '2026_07_08_000001_create_student_quarterly_grades_table', 19);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (31, '2026_07_08_000002_create_research_instrument_reviews_table', 20);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (32, '2026_07_08_000003_add_content_type_to_lesson_sections', 21);
INSERT INTO `migrations` (`id`, `migration`, `batch`) VALUES (33, '2026_07_13_000000_create_student_lesson_flow_tables', 22);
COMMIT;
-- ----------------------------
-- Table structure for model_has_permissions
-- ----------------------------
DROP TABLE IF EXISTS `model_has_permissions`;
CREATE TABLE `model_has_permissions` (
  `permission_id` BIGINT NOT NULL,
  `model_type` VARCHAR(255) NOT NULL,
  `model_id` BIGINT NOT NULL,
  PRIMARY KEY (`permission_id`, `model_id`, `model_type`),
  CONSTRAINT `model_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of model_has_permissions
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for model_has_roles
-- ----------------------------
DROP TABLE IF EXISTS `model_has_roles`;
CREATE TABLE `model_has_roles` (
  `role_id` BIGINT NOT NULL,
  `model_type` VARCHAR(255) NOT NULL,
  `model_id` BIGINT NOT NULL,
  PRIMARY KEY (`role_id`, `model_id`, `model_type`),
  CONSTRAINT `model_has_roles_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of model_has_roles
-- ----------------------------
START TRANSACTION;
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES (1, 'App\Models\User', 1);
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES (2, 'App\Models\User', 3);
INSERT INTO `model_has_roles` (`role_id`, `model_type`, `model_id`) VALUES (3, 'App\Models\User', 2);
COMMIT;
-- ----------------------------
-- Table structure for notifications
-- ----------------------------
DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `id` VARCHAR(36) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `notifiable_type` VARCHAR(255) NOT NULL,
  `notifiable_id` BIGINT NOT NULL,
  `data` LONGTEXT NOT NULL,
  `read_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of notifications
-- ----------------------------
START TRANSACTION;
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('1096b9ff-1b53-46cf-af1a-627a637dd4d3', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":9,"lesson_title":"Introduction to Solving One-Step Equations","subject":"Algebra","activity_count":5}', '2026-07-01 12:54:05', '2026-07-01 12:53:38', '2026-07-01 12:54:05');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('1117e7ec-5589-4cfc-a32a-25a51357068a', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":11,"lesson_title":"Photosynthesis: How Plants Make Food","subject":"Science","activity_count":4}', NULL, '2026-07-12 13:40:08', '2026-07-12 13:40:08');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('18b66b63-ca06-411d-ac6e-2b78b8ed0dd5', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":8,"lesson_title":"Introduction to Media and Information Literacy","subject":"Media and Information Literacy","activity_count":5}', '2026-07-03 12:49:30', '2026-07-03 12:49:04', '2026-07-03 12:49:30');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('7c86336f-ede0-429c-b2d0-0bf1bcfa5be0', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":7,"lesson_title":"Introduction to Media and Information Literacy","subject":"Media and Information Literacy","activity_count":5}', '2026-06-25 10:59:00', '2026-06-25 10:58:50', '2026-06-25 10:59:00');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('e2ef2dcd-dbfe-4a1b-8ffe-e5f0cdeece52', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":8,"lesson_title":"Introduction to Media and Information Literacy","subject":"Media and Information Literacy","activity_count":5}', '2026-06-29 03:36:09', '2026-06-29 03:35:30', '2026-06-29 03:36:09');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('e52a2c40-042f-44ed-aeef-156040632e54', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":13,"lesson_title":"Week 2: Evolution of Media","subject":"Media and Information Literacy","activity_count":4}', '2026-07-18 03:16:12', '2026-07-18 03:13:03', '2026-07-18 03:16:12');
INSERT INTO `notifications` (`id`, `type`, `notifiable_type`, `notifiable_id`, `data`, `read_at`, `created_at`, `updated_at`) VALUES ('ea53903f-4d16-4503-89af-26ad4086e0c4', 'App\Notifications\SubjectLessonNotification', 'App\Models\User', 2, '{"event_type":"lesson_added","lesson_id":12,"lesson_title":"Preparing for Calculus: Functions and Rates of Change","subject":"Calculus","activity_count":4}', '2026-07-07 02:55:04', '2026-07-07 02:54:29', '2026-07-07 02:55:04');
COMMIT;
-- ----------------------------
-- Table structure for password_reset_tokens
-- ----------------------------
DROP TABLE IF EXISTS `password_reset_tokens`;
CREATE TABLE `password_reset_tokens` (
  `email` VARCHAR(255) NOT NULL,
  `token` VARCHAR(255) NOT NULL,
  `created_at` LONGTEXT,
  PRIMARY KEY (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of password_reset_tokens
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for permissions
-- ----------------------------
DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `guard_name` VARCHAR(255) NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of permissions
-- ----------------------------
START TRANSACTION;
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (1, 'user.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (2, 'user.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (3, 'user.update', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (4, 'user.delete', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (5, 'student.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (6, 'student.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (7, 'student.update', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (8, 'student.delete', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (9, 'teacher.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (10, 'teacher.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (11, 'teacher.update', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (12, 'teacher.delete', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (13, 'lesson.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (14, 'lesson.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (15, 'lesson.update', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (16, 'lesson.delete', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (17, 'activity.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (18, 'activity.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (19, 'activity.update', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (20, 'activity.delete', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (21, 'activity.take', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (22, 'test.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (23, 'test.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (24, 'test.update', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (25, 'test.delete', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (26, 'test.take', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (27, 'result.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (28, 'result.export', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (29, 'survey.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (30, 'survey.create', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (31, 'survey.take', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (32, 'ai-feedback.generate', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (33, 'ai-recommendation.view', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (34, 'dashboard.admin', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (35, 'dashboard.teacher', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `permissions` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (36, 'dashboard.student', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
COMMIT;
-- ----------------------------
-- Table structure for research_instrument_reviews
-- ----------------------------
DROP TABLE IF EXISTS `research_instrument_reviews`;
CREATE TABLE `research_instrument_reviews` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `survey_id` BIGINT,
  `review_type` VARCHAR(255) NOT NULL,
  `reviewer_name` VARCHAR(255) NOT NULL,
  `reviewer_role` VARCHAR(255),
  `validity_rating` BIGINT,
  `comments` LONGTEXT,
  `reviewed_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `research_instrument_reviews_survey_id_foreign` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of research_instrument_reviews
-- ----------------------------
START TRANSACTION;
INSERT INTO `research_instrument_reviews` (`id`, `survey_id`, `review_type`, `reviewer_name`, `reviewer_role`, `validity_rating`, `comments`, `reviewed_at`, `created_at`, `updated_at`) VALUES (1, NULL, 'expert_review', 'Stephen Jake', 'Teacher', 5, 'Good', '2026-07-08', '2026-07-08 12:23:19', '2026-07-08 12:23:19');
COMMIT;
-- ----------------------------
-- Table structure for role_has_permissions
-- ----------------------------
DROP TABLE IF EXISTS `role_has_permissions`;
CREATE TABLE `role_has_permissions` (
  `permission_id` BIGINT NOT NULL,
  `role_id` BIGINT NOT NULL,
  PRIMARY KEY (`permission_id`, `role_id`),
  CONSTRAINT `role_has_permissions_permission_id_foreign` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `role_has_permissions_role_id_foreign` FOREIGN KEY (`role_id`) REFERENCES `roles` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of role_has_permissions
-- ----------------------------
START TRANSACTION;
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (1, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (2, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (3, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (4, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (5, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (5, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (6, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (7, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (8, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (9, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (10, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (11, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (12, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (13, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (13, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (13, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (14, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (14, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (15, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (15, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (16, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (17, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (17, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (17, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (18, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (18, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (19, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (19, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (20, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (21, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (21, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (22, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (22, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (22, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (23, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (23, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (24, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (24, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (25, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (26, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (26, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (27, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (27, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (28, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (28, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (29, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (29, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (30, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (30, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (31, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (31, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (32, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (32, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (32, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (33, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (33, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (33, 3);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (34, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (35, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (35, 2);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (36, 1);
INSERT INTO `role_has_permissions` (`permission_id`, `role_id`) VALUES (36, 3);
COMMIT;
-- ----------------------------
-- Table structure for roles
-- ----------------------------
DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `guard_name` VARCHAR(255) NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of roles
-- ----------------------------
START TRANSACTION;
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (1, 'admin', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (2, 'teacher', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
INSERT INTO `roles` (`id`, `name`, `guard_name`, `created_at`, `updated_at`) VALUES (3, 'student', 'web', '2026-05-13 16:02:07', '2026-05-13 16:02:07');
COMMIT;
-- ----------------------------
-- Table structure for sessions
-- ----------------------------
DROP TABLE IF EXISTS `sessions`;
CREATE TABLE `sessions` (
  `id` VARCHAR(255) NOT NULL,
  `user_id` BIGINT,
  `ip_address` VARCHAR(45),
  `user_agent` LONGTEXT,
  `payload` LONGTEXT NOT NULL,
  `last_activity` BIGINT NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of sessions
-- ----------------------------
START TRANSACTION;
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('68m1Y5jRIeBmCsZGB7EtgYC13bWMvo2MRFejcEEZ', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJ3eHZuNXVxejlIWGhHM2sxcmdJNll0emRadG5PY3ZlNzdyN2lxUUFxIiwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1792587590);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('NW0B1HDGd6FrRN6V9prV5xqnHpP9WRfsHYd4g4RX', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiJsaEpGbmZ1WWJ5OUhYdVJLbjVOa1FOSGNOZ0NMUFpXTDBSU3ZqSzVJIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1792657178);
INSERT INTO `sessions` (`id`, `user_id`, `ip_address`, `user_agent`, `payload`, `last_activity`) VALUES ('VzLDQufQwDwJWKTFecne2vSDkQkYkAWu6BQsvRNW', NULL, '127.0.0.1', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/155.0.0.0 Safari/537.36', 'eyJfdG9rZW4iOiI5TUpxOUxROFNLNnBUajUxNUJ5emVtVm9HQVcxY2kzYmdNZjFPOEhlIiwiX3ByZXZpb3VzIjp7InVybCI6Imh0dHA6XC9cLzEyNy4wLjAuMTo4MDAwXC9sb2dpbiIsInJvdXRlIjoibG9naW4ifSwiX2ZsYXNoIjp7Im9sZCI6W10sIm5ldyI6W119fQ==', 1792645461);
COMMIT;
-- ----------------------------
-- Table structure for slide_responses
-- ----------------------------
DROP TABLE IF EXISTS `slide_responses`;
CREATE TABLE `slide_responses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_slide_id` BIGINT NOT NULL,
  `lesson_id` BIGINT NOT NULL,
  `answer` LONGTEXT,
  `is_correct` BIGINT,
  `responded_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `slide_responses_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `slide_responses_lesson_slide_id_foreign` FOREIGN KEY (`lesson_slide_id`) REFERENCES `lesson_slides` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `slide_responses_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of slide_responses
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for slide_uploads
-- ----------------------------
DROP TABLE IF EXISTS `slide_uploads`;
CREATE TABLE `slide_uploads` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `lesson_id` BIGINT NOT NULL,
  `original_filename` VARCHAR(255) NOT NULL,
  `file_path` VARCHAR(255) NOT NULL,
  `status` VARCHAR(255) NOT NULL,
  `error_message` LONGTEXT,
  `slide_count` BIGINT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `slide_uploads_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of slide_uploads
-- ----------------------------
START TRANSACTION;
INSERT INTO `slide_uploads` (`id`, `lesson_id`, `original_filename`, `file_path`, `status`, `error_message`, `slide_count`, `created_at`, `updated_at`) VALUES (5, 8, 'moral_character.pptx', 'uploads/slides/xHTupon9uJxrXJmoiEk9k7P6LP7UORclOw3UvVis.pptx', 'pending', NULL, NULL, '2026-07-05 13:32:15', '2026-07-05 13:32:15');
COMMIT;
-- ----------------------------
-- Table structure for student_activity_answers
-- ----------------------------
DROP TABLE IF EXISTS `student_activity_answers`;
CREATE TABLE `student_activity_answers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_activity_id` BIGINT NOT NULL,
  `answer` LONGTEXT,
  `is_correct` BIGINT,
  `score` DECIMAL(5,2),
  `feedback` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_activity_answers_lesson_activity_id_foreign` FOREIGN KEY (`lesson_activity_id`) REFERENCES `lesson_activities` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `student_activity_answers_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student_activity_answers
-- ----------------------------
START TRANSACTION;
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (60, 1, 75, '"y"', 1, 1.00, 'The variable is the letter that represents an unknown value, which is ''y'' in this equation.', '2026-07-01 12:55:04', '2026-07-01 12:55:04');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (61, 1, 76, '"Addition"', 0, 0.00, 'Review your answer and compare it with the correct response.', '2026-07-01 12:55:15', '2026-07-01 12:55:15');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (62, 1, 77, '"n = 10"', 1, 1.00, 'To isolate ''n'', subtract 15 from both sides: n + 15 - 15 = 25 - 15, so n = 10.', '2026-07-01 12:55:59', '2026-07-01 12:55:59');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (68, 1, 78, '"k = 49"', 0, 0.00, 'Review your answer and compare it with the correct response.', '2026-07-05 13:50:55', '2026-07-05 13:50:55');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (81, 1, 133, '"To create the most viral content"', 0, 0.00, 'Review your answer and compare it with the correct response.', '2026-07-08 02:28:08', '2026-07-08 02:28:08');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (82, 1, 134, '"Makes you popular on social media"', 0, 0.00, 'Review your answer and compare it with the correct response.', '2026-07-08 02:28:27', '2026-07-08 02:28:27');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (83, 1, 135, '"asdasdasd"', NULL, NULL, 'Reflection saved.', '2026-07-08 02:45:52', '2026-07-08 02:45:52');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (84, 1, 136, '"Consider alternative perspectives"', 0, 0.00, 'Review your answer and compare it with the correct response.', '2026-07-08 02:46:00', '2026-07-08 02:46:00');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (85, 1, 137, '"asdasdasd"', NULL, NULL, 'Reflection saved.', '2026-07-08 02:46:12', '2026-07-08 02:46:12');
INSERT INTO `student_activity_answers` (`id`, `student_id`, `lesson_activity_id`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (86, 1, 142, '"Yes, as long as 5 and 10 are real numbers."', 0, 0.00, 'Review your answer and compare it with the correct response.', '2026-07-08 14:40:42', '2026-07-08 14:40:42');
COMMIT;
-- ----------------------------
-- Table structure for student_activity_attempts
-- ----------------------------
DROP TABLE IF EXISTS `student_activity_attempts`;
CREATE TABLE `student_activity_attempts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_activity_id` BIGINT NOT NULL,
  `attempt_number` BIGINT NOT NULL,
  `answer` LONGTEXT,
  `is_correct` BIGINT,
  `score` DECIMAL(8,2),
  `feedback` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_activity_attempts_lesson_activity_id_foreign` FOREIGN KEY (`lesson_activity_id`) REFERENCES `lesson_activities` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `student_activity_attempts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student_activity_attempts
-- ----------------------------
START TRANSACTION;
INSERT INTO `student_activity_attempts` (`id`, `student_id`, `lesson_activity_id`, `attempt_number`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (1, 1, 76, 2, '"Division"', 1, 1.00, 'Division is the inverse operation of multiplication, meaning it undoes multiplication.', '2026-07-13 02:39:23', '2026-07-13 02:39:23');
INSERT INTO `student_activity_attempts` (`id`, `student_id`, `lesson_activity_id`, `attempt_number`, `answer`, `is_correct`, `score`, `feedback`, `created_at`, `updated_at`) VALUES (2, 1, 78, 2, '"k = 6"', 1, 1.00, 'To isolate ''k'', divide both sides by 7: 7k / 7 = 42 / 7, so k = 6.', '2026-07-13 02:39:56', '2026-07-13 02:39:56');
COMMIT;
-- ----------------------------
-- Table structure for student_cue_responses
-- ----------------------------
DROP TABLE IF EXISTS `student_cue_responses`;
CREATE TABLE `student_cue_responses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_cue_point_id` BIGINT NOT NULL,
  `answer` LONGTEXT,
  `is_correct` BIGINT,
  `answered_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_cue_responses_lesson_cue_point_id_foreign` FOREIGN KEY (`lesson_cue_point_id`) REFERENCES `lesson_cue_points` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `student_cue_responses_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student_cue_responses
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for student_lesson_question_attempts
-- ----------------------------
DROP TABLE IF EXISTS `student_lesson_question_attempts`;
CREATE TABLE `student_lesson_question_attempts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_question_id` BIGINT NOT NULL,
  `attempt_number` BIGINT NOT NULL,
  `selected_answer` VARCHAR(255) NOT NULL,
  `is_correct` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_lesson_question_attempts_lesson_question_id_foreign` FOREIGN KEY (`lesson_question_id`) REFERENCES `lesson_questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `student_lesson_question_attempts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student_lesson_question_attempts
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for student_lesson_step_progress
-- ----------------------------
DROP TABLE IF EXISTS `student_lesson_step_progress`;
CREATE TABLE `student_lesson_step_progress` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `lesson_id` BIGINT NOT NULL,
  `lesson_media_id` BIGINT,
  `step_key` VARCHAR(255) NOT NULL,
  `position_seconds` BIGINT NOT NULL,
  `completed_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_lesson_step_progress_lesson_id_foreign` FOREIGN KEY (`lesson_id`) REFERENCES `lessons` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `student_lesson_step_progress_lesson_media_id_foreign` FOREIGN KEY (`lesson_media_id`) REFERENCES `lesson_media` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `student_lesson_step_progress_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student_lesson_step_progress
-- ----------------------------
START TRANSACTION;
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (1, 1, 9, NULL, 'section:65:reading', 0, '2026-07-05 13:50:55', '2026-07-13 02:38:10', '2026-07-13 02:38:10');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (2, 1, 9, NULL, 'section:66:reading', 0, '2026-07-05 13:50:55', '2026-07-13 02:38:10', '2026-07-13 02:38:10');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (3, 1, 9, NULL, 'section:67:reading', 0, '2026-07-05 13:50:55', '2026-07-13 02:38:10', '2026-07-13 02:38:10');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (4, 1, 9, NULL, 'section:68:reading', 0, '2026-07-05 13:50:55', '2026-07-13 02:38:10', '2026-07-13 02:38:10');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (5, 1, 8, NULL, 'section:112:reading', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (6, 1, 8, NULL, 'media:30', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (7, 1, 8, NULL, 'activity:133', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (8, 1, 8, NULL, 'section:113:reading', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (9, 1, 8, NULL, 'media:31', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (10, 1, 8, NULL, 'activity:134', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (11, 1, 8, NULL, 'section:114:reading', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (12, 1, 8, NULL, 'activity:135', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (13, 1, 8, NULL, 'section:115:reading', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (14, 1, 8, NULL, 'activity:136', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (15, 1, 8, NULL, 'activity:137', 0, '2026-07-08 02:46:12', '2026-07-13 02:40:22', '2026-07-13 02:40:22');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (16, 1, 13, NULL, 'section:130:reading', 0, '2026-07-18 03:16:37', '2026-07-18 03:16:37', '2026-07-18 03:16:37');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (18, 1, 13, NULL, 'section:131:reading', 0, '2026-07-18 03:20:07', '2026-07-18 03:20:07', '2026-07-18 03:20:07');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (19, 1, 13, NULL, 'section:132:reading', 0, '2026-07-18 03:21:10', '2026-07-18 03:21:10', '2026-07-18 03:21:10');
INSERT INTO `student_lesson_step_progress` (`id`, `student_id`, `lesson_id`, `lesson_media_id`, `step_key`, `position_seconds`, `completed_at`, `created_at`, `updated_at`) VALUES (20, 1, 13, NULL, 'section:133:reading', 0, '2026-07-18 03:33:33', '2026-07-18 03:33:33', '2026-07-18 03:33:33');
COMMIT;
-- ----------------------------
-- Table structure for student_quarterly_grades
-- ----------------------------
DROP TABLE IF EXISTS `student_quarterly_grades`;
CREATE TABLE `student_quarterly_grades` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `subject` VARCHAR(255) NOT NULL,
  `school_year` VARCHAR(255),
  `quarter_1` DECIMAL(5,2),
  `quarter_2` DECIMAL(5,2),
  `quarter_3` DECIMAL(5,2),
  `quarter_4` DECIMAL(5,2),
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `student_quarterly_grades_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of student_quarterly_grades
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for students
-- ----------------------------
DROP TABLE IF EXISTS `students`;
CREATE TABLE `students` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `student_code` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `grade_level` VARCHAR(255) NOT NULL,
  `section` VARCHAR(255) NOT NULL,
  `consent_status` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `students_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of students
-- ----------------------------
START TRANSACTION;
INSERT INTO `students` (`id`, `user_id`, `student_code`, `first_name`, `last_name`, `grade_level`, `section`, `consent_status`, `created_at`, `updated_at`) VALUES (1, 2, 'STU-001', 'rex', 'marcella', 'Grade 12', 'STEM A', 1, '2026-05-14 03:14:03', '2026-05-14 03:14:03');
COMMIT;
-- ----------------------------
-- Table structure for survey_answers
-- ----------------------------
DROP TABLE IF EXISTS `survey_answers`;
CREATE TABLE `survey_answers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `survey_response_id` BIGINT NOT NULL,
  `survey_question_id` BIGINT NOT NULL,
  `rating` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `survey_answers_survey_question_id_foreign` FOREIGN KEY (`survey_question_id`) REFERENCES `survey_questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `survey_answers_survey_response_id_foreign` FOREIGN KEY (`survey_response_id`) REFERENCES `survey_responses` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of survey_answers
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for survey_questions
-- ----------------------------
DROP TABLE IF EXISTS `survey_questions`;
CREATE TABLE `survey_questions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `survey_id` BIGINT NOT NULL,
  `question` LONGTEXT NOT NULL,
  `category` VARCHAR(255) NOT NULL,
  `sort_order` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `survey_questions_survey_id_foreign` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of survey_questions
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for survey_responses
-- ----------------------------
DROP TABLE IF EXISTS `survey_responses`;
CREATE TABLE `survey_responses` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `survey_id` BIGINT NOT NULL,
  `student_id` BIGINT NOT NULL,
  `submitted_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `survey_responses_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `survey_responses_survey_id_foreign` FOREIGN KEY (`survey_id`) REFERENCES `surveys` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of survey_responses
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for surveys
-- ----------------------------
DROP TABLE IF EXISTS `surveys`;
CREATE TABLE `surveys` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `description` LONGTEXT,
  `is_published` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of surveys
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for teachers
-- ----------------------------
DROP TABLE IF EXISTS `teachers`;
CREATE TABLE `teachers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `employee_no` VARCHAR(255) NOT NULL,
  `first_name` VARCHAR(255) NOT NULL,
  `last_name` VARCHAR(255) NOT NULL,
  `department` VARCHAR(255),
  `specialization` VARCHAR(255),
  `position` VARCHAR(255),
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `teachers_user_id_foreign` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of teachers
-- ----------------------------
START TRANSACTION;
INSERT INTO `teachers` (`id`, `user_id`, `employee_no`, `first_name`, `last_name`, `department`, `specialization`, `position`, `created_at`, `updated_at`) VALUES (1, 3, 'TCH-001', 'rene', 'marcella', 'Senior High School', 'TLE', 'Teacher I', '2026-05-14 03:26:42', '2026-05-14 03:26:42');
COMMIT;
-- ----------------------------
-- Table structure for test_attempt_answers
-- ----------------------------
DROP TABLE IF EXISTS `test_attempt_answers`;
CREATE TABLE `test_attempt_answers` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `test_attempt_id` BIGINT NOT NULL,
  `test_question_id` BIGINT NOT NULL,
  `selected_answer` VARCHAR(255),
  `is_correct` BIGINT NOT NULL,
  `points_earned` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `test_attempt_answers_test_attempt_id_foreign` FOREIGN KEY (`test_attempt_id`) REFERENCES `test_attempts` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `test_attempt_answers_test_question_id_foreign` FOREIGN KEY (`test_question_id`) REFERENCES `test_questions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of test_attempt_answers
-- ----------------------------
START TRANSACTION;
COMMIT;
-- ----------------------------
-- Table structure for test_attempts
-- ----------------------------
DROP TABLE IF EXISTS `test_attempts`;
CREATE TABLE `test_attempts` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `student_id` BIGINT NOT NULL,
  `test_type` VARCHAR(255) NOT NULL,
  `score` BIGINT NOT NULL,
  `total_items` BIGINT NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `started_at` LONGTEXT,
  `submitted_at` LONGTEXT,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  `test_id` BIGINT,
  PRIMARY KEY (`id`),
  CONSTRAINT `test_attempts_student_id_foreign` FOREIGN KEY (`student_id`) REFERENCES `students` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT,
  CONSTRAINT `test_attempts_test_id_foreign` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE SET NULL ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of test_attempts
-- ----------------------------
START TRANSACTION;
INSERT INTO `test_attempts` (`id`, `student_id`, `test_type`, `score`, `total_items`, `percentage`, `started_at`, `submitted_at`, `created_at`, `updated_at`, `test_id`) VALUES (1, 1, 'pretest', 10, 10, 100.00, '2026-05-23 04:42:43', '2026-05-23 04:42:43', '2026-05-23 04:42:43', '2026-05-23 04:42:43', 1);
INSERT INTO `test_attempts` (`id`, `student_id`, `test_type`, `score`, `total_items`, `percentage`, `started_at`, `submitted_at`, `created_at`, `updated_at`, `test_id`) VALUES (2, 1, 'posttest', 8, 10, 80.00, '2026-05-23 05:13:59', '2026-05-23 05:13:59', '2026-05-23 05:13:59', '2026-05-23 05:13:59', 2);
COMMIT;
-- ----------------------------
-- Table structure for test_questions
-- ----------------------------
DROP TABLE IF EXISTS `test_questions`;
CREATE TABLE `test_questions` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `test_id` BIGINT NOT NULL,
  `question` LONGTEXT NOT NULL,
  `choices` LONGTEXT NOT NULL,
  `correct_answer` VARCHAR(255) NOT NULL,
  `explanation` LONGTEXT,
  `points` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`),
  CONSTRAINT `test_questions_test_id_foreign` FOREIGN KEY (`test_id`) REFERENCES `tests` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of test_questions
-- ----------------------------
START TRANSACTION;
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (21, 1, 'Which statement best describes Newton''s First Law of Motion?', '{"A": "An object changes motion only when acted on by a net external force.", "B": "Force is always equal to mass divided by acceleration.", "C": "Every force acts without any opposite force.", "D": "Objects always slow down because motion naturally disappears."}', 'A', 'Newton''s First Law states that motion stays the same unless a net external force changes it.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (22, 1, 'A book rests on a table and remains at rest. Which idea explains why it stays there?', '{"A": "The book has no mass.", "B": "The forces on the book are balanced.", "C": "Gravity is not acting on the book.", "D": "The table pushes the book downward."}', 'B', 'The upward normal force balances the downward weight, so there is no net force.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (23, 1, 'What is inertia?', '{"A": "The tendency of an object to resist changes in its motion.", "B": "The force that pulls objects toward Earth.", "C": "The speed of an object at one instant.", "D": "The distance an object travels per second."}', 'A', 'Inertia is resistance to changes in motion and increases with mass.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (24, 1, 'Which object has the greatest inertia?', '{"A": "An empty plastic bottle.", "B": "A basketball.", "C": "A full backpack.", "D": "A sheet of paper."}', 'C', 'The full backpack has the greatest mass, so it has the greatest inertia.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (25, 1, 'Newton''s Second Law is commonly written as:', '{"A": "F = ma", "B": "a = mF", "C": "F = m/a", "D": "m = Fa"}', 'A', 'Newton''s Second Law relates net force, mass, and acceleration as F = ma.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (26, 1, 'If the same force is applied to two carts, the cart with less mass will:', '{"A": "Accelerate more.", "B": "Accelerate less.", "C": "Have zero acceleration.", "D": "Move only if friction is absent."}', 'A', 'For the same force, acceleration is greater when mass is smaller.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (27, 1, 'A 3 kg object accelerates at 2 m/s^2. What net force acts on it?', '{"A": "1.5 N", "B": "5 N", "C": "6 N", "D": "9 N"}', 'C', 'Using F = ma, force is 3 kg x 2 m/s^2 = 6 N.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (28, 1, 'Which pair is an action-reaction pair?', '{"A": "A hand pushes a wall, and the wall pushes the hand.", "B": "Earth pulls a ball down, and air pushes the ball sideways.", "C": "A car moves forward, and friction slows it down.", "D": "A table supports a book, and gravity pulls the book down."}', 'A', 'Action-reaction forces are equal and opposite forces between two interacting objects.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (29, 1, 'When a swimmer pushes water backward, the swimmer moves forward because:', '{"A": "The water exerts an equal and opposite force on the swimmer.", "B": "The swimmer removes all friction from the water.", "C": "The swimmer''s mass becomes smaller.", "D": "Gravity pushes the swimmer forward."}', 'A', 'This is Newton''s Third Law: the water pushes back on the swimmer.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (30, 1, 'A passenger lurches forward when a moving jeepney suddenly stops. Which law best explains this?', '{"A": "Newton''s First Law.", "B": "Newton''s Second Law.", "C": "Newton''s Third Law.", "D": "Law of Universal Gravitation only."}', 'A', 'The passenger''s body tends to keep moving forward because of inertia.', 1, '2026-06-19 14:19:39', '2026-06-19 14:19:39');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (41, 2, 'A ball rolling on a smooth floor keeps moving until friction or another force slows it. Which law is shown?', '{"A": "Newton''s First Law.", "B": "Newton''s Second Law.", "C": "Newton''s Third Law.", "D": "Conservation of charge."}', 'A', 'The ball tends to maintain its motion unless a net force changes it.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (42, 2, 'A picture frame hanging still on a wall has no acceleration because:', '{"A": "Its forces are balanced.", "B": "It has no weight.", "C": "It has no inertia.", "D": "Only one force acts on it."}', 'A', 'Balanced forces produce zero net force, so the frame does not accelerate.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (43, 2, 'Why is it harder to start pushing a loaded cart than an empty cart?', '{"A": "The loaded cart has more inertia.", "B": "The empty cart has more inertia.", "C": "The loaded cart has no acceleration.", "D": "The empty cart has no mass."}', 'A', 'Greater mass means greater inertia and more resistance to changes in motion.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (44, 2, 'Which situation shows inertia most clearly?', '{"A": "Dust leaves a rug when the rug is quickly shaken.", "B": "A magnet attracts iron filings.", "C": "A lamp lights when switched on.", "D": "Ice melts in sunlight."}', 'A', 'The dust tends to remain at rest while the rug moves suddenly.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (45, 2, 'If net force doubles while mass stays the same, acceleration will:', '{"A": "Double.", "B": "Be cut in half.", "C": "Stay exactly the same.", "D": "Become zero."}', 'A', 'From F = ma, acceleration is directly proportional to net force for constant mass.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (46, 2, 'Two students push identical boxes. One uses a larger net force. That box will:', '{"A": "Have greater acceleration.", "B": "Have less mass.", "C": "Have no reaction force.", "D": "Move with no friction at all."}', 'A', 'With equal mass, the larger net force produces larger acceleration.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (47, 2, 'What is the net force on a 5 kg object accelerating at 4 m/s^2?', '{"A": "9 N", "B": "16 N", "C": "20 N", "D": "25 N"}', 'C', 'F = ma = 5 kg x 4 m/s^2 = 20 N.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (48, 2, 'When a foot kicks a soccer ball, the matching reaction force is:', '{"A": "The ball pushes back on the foot.", "B": "Earth pulls down on the ball.", "C": "Air pushes forward on the ball.", "D": "The ground pushes up on the player."}', 'A', 'The ball exerts an equal and opposite force on the foot.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (49, 2, 'A rocket moves upward as exhaust gases are pushed downward. This demonstrates:', '{"A": "Newton''s Third Law.", "B": "Newton''s First Law only.", "C": "Inertia with no forces.", "D": "Balanced forces only."}', 'A', 'The downward push on gases creates an upward reaction force on the rocket.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
INSERT INTO `test_questions` (`id`, `test_id`, `question`, `choices`, `correct_answer`, `explanation`, `points`, `created_at`, `updated_at`) VALUES (50, 2, 'A student wearing a seatbelt is held back when a car stops quickly. What does the seatbelt do?', '{"A": "Applies a force that changes the student''s forward motion.", "B": "Removes the student''s inertia.", "C": "Increases the student''s mass.", "D": "Cancels gravity completely."}', 'A', 'The seatbelt provides the external force needed to slow the student safely.', 1, '2026-06-19 14:19:49', '2026-06-19 14:19:49');
COMMIT;
-- ----------------------------
-- Table structure for tests
-- ----------------------------
DROP TABLE IF EXISTS `tests`;
CREATE TABLE `tests` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `title` VARCHAR(255) NOT NULL,
  `test_type` VARCHAR(255) NOT NULL,
  `subject` VARCHAR(255),
  `topic` VARCHAR(255),
  `is_active` BIGINT NOT NULL,
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of tests
-- ----------------------------
START TRANSACTION;
INSERT INTO `tests` (`id`, `title`, `test_type`, `subject`, `topic`, `is_active`, `created_at`, `updated_at`) VALUES (1, 'Pretest: Newton''s Laws of Motion', 'pretest', 'Physical Science', 'Newton''s Laws of Motion', 0, '2026-05-23 04:27:45', '2026-06-19 14:19:39');
INSERT INTO `tests` (`id`, `title`, `test_type`, `subject`, `topic`, `is_active`, `created_at`, `updated_at`) VALUES (2, 'Posttest: Newton''s Laws of Motion', 'posttest', 'Physical Science', 'Newton''s Laws of Motion', 0, '2026-05-23 04:27:45', '2026-06-19 14:19:49');
COMMIT;
-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified_at` LONGTEXT,
  `password` VARCHAR(255) NOT NULL,
  `two_factor_secret` LONGTEXT,
  `two_factor_recovery_codes` LONGTEXT,
  `two_factor_confirmed_at` LONGTEXT,
  `remember_token` VARCHAR(100),
  `created_at` LONGTEXT,
  `updated_at` LONGTEXT,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of users
-- ----------------------------
START TRANSACTION;
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES (1, 'System Administrator', 'admin@admin.com', NULL, '1234567890', NULL, NULL, NULL, NULL, '2026-05-13 16:02:07', '2026-10-21 12:50:40');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES (2, 'Rene Marcella', 'rene@example.com', NULL, 'Rene@09', NULL, NULL, NULL, NULL, '2026-05-14 03:14:03', '2026-05-14 03:14:03');
INSERT INTO `users` (`id`, `name`, `email`, `email_verified_at`, `password`, `two_factor_secret`, `two_factor_recovery_codes`, `two_factor_confirmed_at`, `remember_token`, `created_at`, `updated_at`) VALUES (3, 'Rene marcella', 'marcella@example.com', NULL, 'marcella@12345', NULL, NULL, NULL, '', '2026-05-14 03:26:42', '2026-05-14 03:26:42');
COMMIT;
-- ----------------------------
-- Indexes structure for table ai_lesson_suggestions
-- ----------------------------
CREATE INDEX `ai_lesson_suggestions_lesson_id_foreign`
ON `ai_lesson_suggestions` (
  `lesson_id` ASC
);
CREATE INDEX `ai_lesson_suggestions_teacher_id_foreign`
ON `ai_lesson_suggestions` (
  `teacher_id` ASC
);

-- ----------------------------
-- Indexes structure for table cache
-- ----------------------------
CREATE INDEX `cache_expiration_index`
ON `cache` (
  `expiration` ASC
);

-- ----------------------------
-- Indexes structure for table cache_locks
-- ----------------------------
CREATE INDEX `cache_locks_expiration_index`
ON `cache_locks` (
  `expiration` ASC
);

-- ----------------------------
-- Indexes structure for table failed_jobs
-- ----------------------------
CREATE UNIQUE INDEX `failed_jobs_uuid_unique`
ON `failed_jobs` (
  `uuid` ASC
);

-- ----------------------------
-- Indexes structure for table jobs
-- ----------------------------
CREATE INDEX `jobs_queue_index`
ON `jobs` (
  `queue` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_activities
-- ----------------------------
CREATE INDEX `lesson_activities_lesson_id_foreign`
ON `lesson_activities` (
  `lesson_id` ASC
);
CREATE INDEX `lesson_activities_lesson_section_id_foreign`
ON `lesson_activities` (
  `lesson_section_id` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_cue_points
-- ----------------------------
CREATE INDEX `lesson_cue_points_lesson_media_id_timestamp_seconds_index`
ON `lesson_cue_points` (
  `lesson_media_id` ASC,
  `timestamp_seconds` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_media
-- ----------------------------
CREATE INDEX `lesson_media_lesson_id_foreign`
ON `lesson_media` (
  `lesson_id` ASC
);
CREATE INDEX `lesson_media_lesson_section_id_foreign`
ON `lesson_media` (
  `lesson_section_id` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_progress
-- ----------------------------
CREATE UNIQUE INDEX `lesson_progress_student_id_lesson_id_unique`
ON `lesson_progress` (
  `student_id` ASC,
  `lesson_id` ASC
);
CREATE INDEX `lesson_progress_lesson_id_foreign`
ON `lesson_progress` (
  `lesson_id` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_questions
-- ----------------------------
CREATE INDEX `lesson_questions_lesson_id_foreign`
ON `lesson_questions` (
  `lesson_id` ASC
);
CREATE INDEX `lesson_questions_lesson_activity_id_foreign`
ON `lesson_questions` (
  `lesson_activity_id` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_sections
-- ----------------------------
CREATE INDEX `lesson_sections_lesson_id_foreign`
ON `lesson_sections` (
  `lesson_id` ASC
);

-- ----------------------------
-- Indexes structure for table lesson_slides
-- ----------------------------
CREATE INDEX `lesson_slides_lesson_id_order_index`
ON `lesson_slides` (
  `lesson_id` ASC,
  `order` ASC
);

-- ----------------------------
-- Indexes structure for table lessons
-- ----------------------------
CREATE INDEX `lessons_teacher_id_foreign`
ON `lessons` (
  `teacher_id` ASC
);

-- ----------------------------
-- Indexes structure for table model_has_permissions
-- ----------------------------
CREATE INDEX `model_has_permissions_model_id_model_type_index`
ON `model_has_permissions` (
  `model_id` ASC,
  `model_type` ASC
);

-- ----------------------------
-- Indexes structure for table model_has_roles
-- ----------------------------
CREATE INDEX `model_has_roles_model_id_model_type_index`
ON `model_has_roles` (
  `model_id` ASC,
  `model_type` ASC
);

-- ----------------------------
-- Indexes structure for table notifications
-- ----------------------------
CREATE INDEX `notifications_notifiable_type_notifiable_id_index`
ON `notifications` (
  `notifiable_type` ASC,
  `notifiable_id` ASC
);

-- ----------------------------
-- Indexes structure for table permissions
-- ----------------------------
CREATE UNIQUE INDEX `permissions_name_guard_name_unique`
ON `permissions` (
  `name` ASC,
  `guard_name` ASC
);

-- ----------------------------
-- Indexes structure for table research_instrument_reviews
-- ----------------------------
CREATE INDEX `research_instrument_reviews_survey_id_foreign`
ON `research_instrument_reviews` (
  `survey_id` ASC
);

-- ----------------------------
-- Indexes structure for table role_has_permissions
-- ----------------------------
CREATE INDEX `role_has_permissions_role_id_foreign`
ON `role_has_permissions` (
  `role_id` ASC
);

-- ----------------------------
-- Indexes structure for table roles
-- ----------------------------
CREATE UNIQUE INDEX `roles_name_guard_name_unique`
ON `roles` (
  `name` ASC,
  `guard_name` ASC
);

-- ----------------------------
-- Indexes structure for table sessions
-- ----------------------------
CREATE INDEX `sessions_user_id_index`
ON `sessions` (
  `user_id` ASC
);
CREATE INDEX `sessions_last_activity_index`
ON `sessions` (
  `last_activity` ASC
);

-- ----------------------------
-- Indexes structure for table slide_responses
-- ----------------------------
CREATE UNIQUE INDEX `slide_responses_student_id_lesson_slide_id_unique`
ON `slide_responses` (
  `student_id` ASC,
  `lesson_slide_id` ASC
);
CREATE INDEX `slide_responses_lesson_slide_id_foreign`
ON `slide_responses` (
  `lesson_slide_id` ASC
);
CREATE INDEX `slide_responses_lesson_id_foreign`
ON `slide_responses` (
  `lesson_id` ASC
);

-- ----------------------------
-- Indexes structure for table slide_uploads
-- ----------------------------
CREATE INDEX `slide_uploads_lesson_id_foreign`
ON `slide_uploads` (
  `lesson_id` ASC
);

-- ----------------------------
-- Indexes structure for table student_activity_answers
-- ----------------------------
CREATE UNIQUE INDEX `student_activity_answers_student_id_lesson_activity_id_unique`
ON `student_activity_answers` (
  `student_id` ASC,
  `lesson_activity_id` ASC
);
CREATE INDEX `student_activity_answers_lesson_activity_id_foreign`
ON `student_activity_answers` (
  `lesson_activity_id` ASC
);

-- ----------------------------
-- Indexes structure for table student_activity_attempts
-- ----------------------------
CREATE UNIQUE INDEX `student_activity_attempt_unique`
ON `student_activity_attempts` (
  `student_id` ASC,
  `lesson_activity_id` ASC,
  `attempt_number` ASC
);
CREATE INDEX `student_activity_attempts_lesson_activity_id_foreign`
ON `student_activity_attempts` (
  `lesson_activity_id` ASC
);

-- ----------------------------
-- Indexes structure for table student_cue_responses
-- ----------------------------
CREATE UNIQUE INDEX `student_cue_responses_student_id_lesson_cue_point_id_unique`
ON `student_cue_responses` (
  `student_id` ASC,
  `lesson_cue_point_id` ASC
);
CREATE INDEX `student_cue_responses_lesson_cue_point_id_foreign`
ON `student_cue_responses` (
  `lesson_cue_point_id` ASC
);

-- ----------------------------
-- Indexes structure for table student_lesson_question_attempts
-- ----------------------------
CREATE UNIQUE INDEX `student_lesson_question_attempt_unique`
ON `student_lesson_question_attempts` (
  `student_id` ASC,
  `lesson_question_id` ASC,
  `attempt_number` ASC
);
CREATE INDEX `student_lesson_question_attempts_lesson_question_id_foreign`
ON `student_lesson_question_attempts` (
  `lesson_question_id` ASC
);

-- ----------------------------
-- Indexes structure for table student_lesson_step_progress
-- ----------------------------
CREATE UNIQUE INDEX `student_lesson_step_unique`
ON `student_lesson_step_progress` (
  `student_id` ASC,
  `lesson_id` ASC,
  `step_key` ASC
);
CREATE INDEX `student_lesson_step_progress_lesson_id_foreign`
ON `student_lesson_step_progress` (
  `lesson_id` ASC
);
CREATE INDEX `student_lesson_step_progress_lesson_media_id_foreign`
ON `student_lesson_step_progress` (
  `lesson_media_id` ASC
);

-- ----------------------------
-- Indexes structure for table student_quarterly_grades
-- ----------------------------
CREATE UNIQUE INDEX `student_quarterly_grades_student_id_subject_school_year_unique`
ON `student_quarterly_grades` (
  `student_id` ASC,
  `subject` ASC,
  `school_year` ASC
);

-- ----------------------------
-- Indexes structure for table students
-- ----------------------------
CREATE UNIQUE INDEX `students_student_code_unique`
ON `students` (
  `student_code` ASC
);
CREATE INDEX `students_user_id_foreign`
ON `students` (
  `user_id` ASC
);

-- ----------------------------
-- Indexes structure for table survey_answers
-- ----------------------------
CREATE UNIQUE INDEX `survey_answers_survey_response_id_survey_question_id_unique`
ON `survey_answers` (
  `survey_response_id` ASC,
  `survey_question_id` ASC
);
CREATE INDEX `survey_answers_survey_question_id_foreign`
ON `survey_answers` (
  `survey_question_id` ASC
);

-- ----------------------------
-- Indexes structure for table survey_questions
-- ----------------------------
CREATE INDEX `survey_questions_survey_id_foreign`
ON `survey_questions` (
  `survey_id` ASC
);

-- ----------------------------
-- Indexes structure for table survey_responses
-- ----------------------------
CREATE UNIQUE INDEX `survey_responses_survey_id_student_id_unique`
ON `survey_responses` (
  `survey_id` ASC,
  `student_id` ASC
);
CREATE INDEX `survey_responses_student_id_foreign`
ON `survey_responses` (
  `student_id` ASC
);

-- ----------------------------
-- Indexes structure for table teachers
-- ----------------------------
CREATE UNIQUE INDEX `teachers_employee_no_unique`
ON `teachers` (
  `employee_no` ASC
);
CREATE INDEX `teachers_user_id_foreign`
ON `teachers` (
  `user_id` ASC
);

-- ----------------------------
-- Indexes structure for table test_attempt_answers
-- ----------------------------
CREATE INDEX `test_attempt_answers_test_attempt_id_foreign`
ON `test_attempt_answers` (
  `test_attempt_id` ASC
);
CREATE INDEX `test_attempt_answers_test_question_id_foreign`
ON `test_attempt_answers` (
  `test_question_id` ASC
);

-- ----------------------------
-- Indexes structure for table test_attempts
-- ----------------------------
CREATE UNIQUE INDEX `test_attempts_student_id_test_type_unique`
ON `test_attempts` (
  `student_id` ASC,
  `test_type` ASC
);
CREATE INDEX `test_attempts_test_id_foreign`
ON `test_attempts` (
  `test_id` ASC
);

-- ----------------------------
-- Indexes structure for table test_questions
-- ----------------------------
CREATE INDEX `test_questions_test_id_foreign`
ON `test_questions` (
  `test_id` ASC
);

-- ----------------------------
-- Indexes structure for table users
-- ----------------------------
CREATE UNIQUE INDEX `users_email_unique`
ON `users` (
  `email` ASC
);

SET FOREIGN_KEY_CHECKS=1;