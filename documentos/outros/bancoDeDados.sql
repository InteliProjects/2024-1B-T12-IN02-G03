CREATE TABLE team (
  id SERIAL PRIMARY KEY,
  id_user INTEGER,
  student_group INTEGER,
  teamName TEXT,
  color VARCHAR,
  universe INTEGER,
  happiness INTEGER
);
		
CREATE TABLE "user" (
  id SERIAL PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  email VARCHAR,
  password VARCHAR,
  nationality VARCHAR,
  university VARCHAR,
  happiness INTEGER,
  image VARCHAR
);
		
CREATE TABLE task (
  id SERIAL PRIMARY KEY,
  id_user INTEGER,
  name CHAR,
  description CHAR
);
		
CREATE TABLE results (
  id SERIAL PRIMARY KEY,
  id_user INTEGER,
  qntA INTEGER,
  qntB INTEGER,
  qntC INTEGER,
  qntD INTEGER,
  qntE INTEGER,
  result VARCHAR
);
		
CREATE TABLE student_team (
  id SERIAL PRIMARY KEY,
  id_user INTEGER,
  id_team INTEGER
);
		
CREATE TABLE decisionMaking (
  id SERIAL PRIMARY KEY,
  id_user INTEGER,
  qntX INTEGER,
  qntY INTEGER,
  style VARCHAR
);
		
CREATE TABLE groupEvaluation (
  id SERIAL PRIMARY KEY,
  id_user INTEGER,
  to_user INTEGER,
  collaboration VARCHAR,
  decision VARCHAR
);

ALTER TABLE team ADD CONSTRAINT fk_team_user FOREIGN KEY (id_user) REFERENCES "user" (id);
ALTER TABLE task ADD CONSTRAINT fk_task_user FOREIGN KEY (id_user) REFERENCES "user" (id);
ALTER TABLE results ADD CONSTRAINT fk_results_user FOREIGN KEY (id_user) REFERENCES "user" (id);
ALTER TABLE student_team ADD CONSTRAINT fk_student_team_user FOREIGN KEY (id_user) REFERENCES "user" (id);
ALTER TABLE student_team ADD CONSTRAINT fk_student_team_team FOREIGN KEY (id_team) REFERENCES team (id);
ALTER TABLE decisionMaking ADD CONSTRAINT fk_decisionMaking_user FOREIGN KEY (id_user) REFERENCES "user" (id);
ALTER TABLE groupEvaluation ADD CONSTRAINT fk_groupEvaluation_user FOREIGN KEY (id_user) REFERENCES "user" (id);
