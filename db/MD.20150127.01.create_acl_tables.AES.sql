CREATE TABLE acl_meta (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);
CREATE TABLE acl_resources (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);
CREATE TABLE acl_parents (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);
CREATE TABLE acl_users (key TEXT NOT NULL PRIMARY KEY, value TEXT[][] NOT NULL);
CREATE TABLE acl_permissions (key TEXT NOT NULL PRIMARY KEY, value JSON NOT NULL);
