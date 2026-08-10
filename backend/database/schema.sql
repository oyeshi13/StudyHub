
CREATE TABLE DEPARTMENTS (
    dept_code INTEGER PRIMARY KEY,
    dept_name VARCHAR(50)
);


INSERT INTO DEPARTMENTS (dept_code, dept_name) VALUES (5, 'CSE');
INSERT INTO DEPARTMENTS (dept_code, dept_name) VALUES (6, 'EEE');
INSERT INTO DEPARTMENTS (dept_code, dept_name) VALUES (1, 'ARCHITECHTURE');


CREATE TABLE Student (
    student_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    department VARCHAR(50) NOT NULL,
    reputation_points INT DEFAULT 0
);


CREATE TABLE Admin (
    admin_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    department VARCHAR(50) NOT NULL
);


CREATE TABLE TAGS (
    tag_id INTEGER PRIMARY KEY,
    tag_title VARCHAR(20) UNIQUE
);



CREATE TABLE DEPT_GROUPS (
    group_id INTEGER PRIMARY KEY,
    dept_code INTEGER UNIQUE REFERENCES DEPARTMENTS(dept_code),
    group_name VARCHAR(50)
);


CREATE TABLE COURSES (
    course_code CHAR(7) PRIMARY KEY,
    course_title VARCHAR(50),
    dept_code INTEGER REFERENCES DEPARTMENTS(dept_code)
);


CREATE TABLE Resources (
    resource_id SERIAL PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    description TEXT,
    file_url TEXT NOT NULL,                  -- PDF/Drive link/File path
    file_type VARCHAR(20) NOT NULL,          -- 'PDF', 'Image', 'Link'
    uploaded_by INT REFERENCES Student(student_id) ON DELETE CASCADE,
    dept_code INT REFERENCES DEPARTMENTS(dept_code) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE DOUBTS (
    doubt_id INTEGER PRIMARY KEY,
    title VARCHAR(100),
    description VARCHAR(500),
    course_code CHAR(7) REFERENCES COURSES(course_code),
    author INTEGER REFERENCES Student(student_id),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    solved BOOL DEFAULT FALSE
);


CREATE TABLE DOUBT_TAGS (
    doubt_id INTEGER REFERENCES DOUBTS(doubt_id),
    tag_id INTEGER REFERENCES TAGS(tag_id),
    PRIMARY KEY (doubt_id, tag_id)
);

CREATE TABLE RESOURCE_COMMENTS (
    comment_id INTEGER PRIMARY KEY,
    comment_text VARCHAR(400),
    resource_id INTEGER REFERENCES Resources(resource_id) ON DELETE CASCADE,
    author INTEGER REFERENCES Student(student_id),
    commented_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE ANSWERS (
    answer_id INTEGER PRIMARY KEY,
    doubt_id INTEGER REFERENCES DOUBTS(doubt_id) ON DELETE CASCADE,
    answer_text VARCHAR(400),
    author INTEGER REFERENCES Student(student_id),
    answered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS BOOKMARKS (
    student_id INT REFERENCES Student(student_id) ON DELETE CASCADE,
    resource_id INT REFERENCES Resources(resource_id) ON DELETE CASCADE,
    bookmarked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (student_id, resource_id)
);


CREATE TABLE IF NOT EXISTS VOTES (
    vote_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES Student(student_id) ON DELETE CASCADE,
    resource_id INT REFERENCES Resources(resource_id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL, -- 'UP' or 'DOWN'
    voted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_user_resource_vote UNIQUE (student_id, resource_id)
);


CREATE TABLE IF NOT EXISTS REPORTS (
    report_id SERIAL PRIMARY KEY,
    student_id INT REFERENCES Student(student_id) ON DELETE CASCADE,
    resource_id INT REFERENCES Resources(resource_id) ON DELETE CASCADE,
    reason TEXT NOT NULL,
    reported_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
