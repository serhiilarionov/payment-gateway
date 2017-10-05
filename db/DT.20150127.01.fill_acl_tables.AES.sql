--
-- PostgreSQL database dump
--

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;

SET search_path = public, pg_catalog;


--
-- Data for Name: acl_parents; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- Data for Name: acl_permissions; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO acl_permissions (key, value) VALUES ('allows_admin_resource', '{"administrator":["access"]}');
INSERT INTO acl_permissions (key, value) VALUES ('allows_employee_resource', '{"employee":["access"]}');
INSERT INTO acl_permissions (key, value) VALUES ('allows_dweller_resource', '{"dweller":["access"]}');


--
-- Data for Name: acl_resources; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO acl_resources (key, value) VALUES ('administrator', '{admin_resource}');
INSERT INTO acl_resources (key, value) VALUES ('employee', '{employee_resource}');
INSERT INTO acl_resources (key, value) VALUES ('dweller', '{dweller_resource}');
