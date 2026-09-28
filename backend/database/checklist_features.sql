CREATE TABLE IF NOT EXISTS VOTE_AUDIT (
    audit_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    actor_student_id INTEGER NOT NULL,
    resource_id INTEGER NOT NULL,
    operation VARCHAR(6) NOT NULL,
    old_vote_type VARCHAR(10),
    new_vote_type VARCHAR(10),
    changed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX IF NOT EXISTS joined_groups_student_group_unique
ON JOINED_GROUPS (student_id, group_id);

CREATE OR REPLACE FUNCTION get_resource_vote_score(p_resource_id INTEGER)
RETURNS INTEGER
LANGUAGE SQL
STABLE
AS $$
    SELECT COALESCE(SUM(CASE WHEN vote_type = 'UP' THEN 1 ELSE -1 END), 0)::INTEGER
    FROM VOTES
    WHERE resource_id = p_resource_id;
$$;

CREATE OR REPLACE FUNCTION validate_resource_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.vote_type := UPPER(BTRIM(NEW.vote_type));
    IF NEW.vote_type NOT IN ('UP', 'DOWN') THEN
        RAISE EXCEPTION 'vote_type must be UP or DOWN';
    END IF;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION audit_resource_vote()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO VOTE_AUDIT (actor_student_id, resource_id, operation, old_vote_type, new_vote_type)
    VALUES (
        COALESCE(NEW.student_id, OLD.student_id),
        COALESCE(NEW.resource_id, OLD.resource_id),
        TG_OP,
        CASE WHEN TG_OP = 'INSERT' THEN NULL ELSE OLD.vote_type END,
        CASE WHEN TG_OP = 'DELETE' THEN NULL ELSE NEW.vote_type END
    );
    RETURN COALESCE(NEW, OLD);
END;
$$;

DROP TRIGGER IF EXISTS votes_validate_type ON VOTES;
CREATE TRIGGER votes_validate_type
BEFORE INSERT OR UPDATE OF vote_type ON VOTES
FOR EACH ROW EXECUTE FUNCTION validate_resource_vote();

DROP TRIGGER IF EXISTS votes_audit_changes ON VOTES;
CREATE TRIGGER votes_audit_changes
AFTER INSERT OR UPDATE OR DELETE ON VOTES
FOR EACH ROW EXECUTE FUNCTION audit_resource_vote();

CREATE OR REPLACE PROCEDURE enroll_new_student(
    p_student_id INTEGER,
    p_name VARCHAR,
    p_email VARCHAR,
    p_password_hash TEXT,
    p_department VARCHAR
)
LANGUAGE plpgsql
AS $$
DECLARE
    v_department_name VARCHAR(50);
    v_group_id INTEGER;
BEGIN
    SELECT d.dept_name, dg.group_id
    INTO v_department_name, v_group_id
    FROM DEPARTMENTS d
    JOIN DEPT_GROUPS dg ON dg.dept_code = d.dept_code
    WHERE LOWER(BTRIM(d.dept_name)) = LOWER(BTRIM(p_department));

    IF NOT FOUND THEN
        RAISE EXCEPTION 'The selected department does not have a group' USING ERRCODE = 'P0002';
    END IF;

    INSERT INTO STUDENT (student_id, name, email, password, department, is_approved)
    VALUES (p_student_id, p_name, LOWER(BTRIM(p_email)), p_password_hash, v_department_name, FALSE);

    INSERT INTO JOINED_GROUPS (student_id, group_id)
    VALUES (p_student_id, v_group_id);
END;
$$;