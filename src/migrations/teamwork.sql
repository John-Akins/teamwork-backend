--
-- PostgreSQL database dump
--

-- Dumped from database version 12.0
-- Dumped by pg_dump version 12.0

-- Started on 2019-11-17 11:28:54

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 207 (class 1259 OID 41088)
-- Name: articleTags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."articleTags" (
    "Id" bigint NOT NULL,
    "tagId" bigint NOT NULL,
    "articleId" bigint NOT NULL
);


ALTER TABLE public."articleTags" OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16405)
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    title character(100) NOT NULL,
    "articleId" numeric(20,0) NOT NULL,
    "createdOn" date NOT NULL,
    "createdBy" character varying(20) NOT NULL,
    article character(1000) NOT NULL,
    "isEdited" boolean,
    "isFlagged" boolean
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16420)
-- Name: feedComments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."feedComments" (
    "feedId" numeric(20,0) NOT NULL,
    "commentId" numeric(20,0) NOT NULL,
    "feedType" character(20) NOT NULL,
    comment character(500) NOT NULL,
    "commentOn" date NOT NULL,
    "commentBy" numeric(20,0) NOT NULL,
    "isFlagged" boolean NOT NULL,
    id bigint NOT NULL
);


ALTER TABLE public."feedComments" OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 49280)
-- Name: flaggedFeeds; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."flaggedFeeds" (
    "flagId" numeric(20,0) NOT NULL,
    "feedId" numeric(20,0) NOT NULL,
    "feedType" character(20) NOT NULL,
    "flaggedOn" date,
    "flaggedBy" character(20)
);


ALTER TABLE public."flaggedFeeds" OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16394)
-- Name: gifs; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.gifs (
    "gifId" integer NOT NULL,
    title character(100) NOT NULL,
    "imageUrl" character(100) NOT NULL,
    "createdOn" date NOT NULL,
    "createdBy" character(20)[] NOT NULL
);


ALTER TABLE public.gifs OWNER TO postgres;

--
-- TOC entry 203 (class 1259 OID 16397)
-- Name: gif_gifId_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

ALTER TABLE public.gifs ALTER COLUMN "gifId" ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public."gif_gifId_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- TOC entry 208 (class 1259 OID 41091)
-- Name: tags; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.tags (
    id bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.tags OWNER TO postgres;

--
-- TOC entry 205 (class 1259 OID 16410)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    "userId" bigint NOT NULL,
    "firstName" character varying(30) NOT NULL,
    "lastName" character varying NOT NULL,
    email character varying NOT NULL,
    address character varying NOT NULL,
    password character varying NOT NULL,
    gender character varying NOT NULL,
    "jobRole" character varying NOT NULL,
    department character varying NOT NULL,
    "isAdmin" boolean NOT NULL,
    "isNewAccount" boolean DEFAULT true NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 2860 (class 0 OID 41088)
-- Dependencies: 207
-- Data for Name: articleTags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."articleTags" ("Id", "tagId", "articleId") VALUES (10001, 10001, 10001);
INSERT INTO public."articleTags" ("Id", "tagId", "articleId") VALUES (10002, 10002, 10002);


--
-- TOC entry 2857 (class 0 OID 16405)
-- Dependencies: 204
-- Data for Name: articles; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.articles (title, "articleId", "createdOn", "createdBy", article, "isEdited", "isFlagged") VALUES ('Old lady tale', 10001, '2019-10-12', '10001', 'One nice Old Lady Tale', NULL, NULL);
INSERT INTO public.articles (title, "articleId", "createdOn", "createdBy", article, "isEdited", "isFlagged") VALUES ('Quick brown fox', 10002, '2019-11-12', '10002', 'One Hell of a quick brown fox', NULL, NULL);
INSERT INTO public.articles (title, "articleId", "createdOn", "createdBy", article, "isEdited", "isFlagged") VALUES ('Ada Lovelace', 10003, '2019-10-12', '10002', 'A computer science fairy tale', NULL, NULL);


--
-- TOC entry 2859 (class 0 OID 16420)
-- Dependencies: 206
-- Data for Name: feedComments; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."feedComments" ("feedId", "commentId", "feedType", comment, "commentOn", "commentBy", "isFlagged", id) VALUES (10001, 10001, 'article             ', 'Very nice                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ', '2019-10-10', 10001, false, 10001);
INSERT INTO public."feedComments" ("feedId", "commentId", "feedType", comment, "commentOn", "commentBy", "isFlagged", id) VALUES (10002, 10002, 'article             ', 'Very nice                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           ', '2019-10-10', 10001, false, 10002);


--
-- TOC entry 2862 (class 0 OID 49280)
-- Dependencies: 209
-- Data for Name: flaggedFeeds; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."flaggedFeeds" ("flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES (1573912681521, 1573912465596, 'article             ', '2019-11-16', '10001               ');
INSERT INTO public."flaggedFeeds" ("flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES (1573912799057, 1573912680426, 'article             ', '2019-11-16', '10001               ');
INSERT INTO public."flaggedFeeds" ("flagId", "feedId", "feedType", "flaggedOn", "flaggedBy") VALUES (1573916174631, 1573912850569, 'article             ', '2019-11-16', '10001               ');



--
-- TOC entry 2855 (class 0 OID 16394)
-- Dependencies: 202
-- Data for Name: gifs; Type: TABLE DATA; Schema: public; Owner: postgres
--



--
-- TOC entry 2861 (class 0 OID 41091)
-- Dependencies: 208
-- Data for Name: tags; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.tags (id, name) VALUES (10001, 'news');
INSERT INTO public.tags (id, name) VALUES (10002, 'productivity');
INSERT INTO public.tags (id, name) VALUES (10003, 'creativity');


--
-- TOC entry 2858 (class 0 OID 16410)
-- Dependencies: 205
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.users ("userId", "firstName", "lastName", email, address, password, gender, "jobRole", department, "isAdmin", "isNewAccount") VALUES (10001, 'Ada', 'Lovelace', 'lovelace@gmail.com', 'LOvelace street', '$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa', 'female', 'Software Engineer', 'IT', true, false);
INSERT INTO public.users ("userId", "firstName", "lastName", email, address, password, gender, "jobRole", department, "isAdmin", "isNewAccount") VALUES (10002, 'Ada', 'Turan', 'turan@gmail.com', 'Turan street', '$2b$10$dTlK9RWsDFxj0jvAARftqeonxRuBVTQVKpsbvk9tt.MsFcjnTjpxa', 'male', 'Software Engineer', 'IT', false, false);


--
-- TOC entry 2868 (class 0 OID 0)
-- Dependencies: 203
-- Name: gif_gifId_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public."gif_gifId_seq"', 1, false);


--
-- TOC entry 2720 (class 2606 OID 16444)
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY ("articleId");


--
-- TOC entry 2728 (class 2606 OID 49284)
-- Name: flaggedFeeds flaggedFeeds_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."flaggedFeeds"
    ADD CONSTRAINT "flaggedFeeds_pkey" PRIMARY KEY ("flagId");


--
-- TOC entry 2718 (class 2606 OID 16689)
-- Name: gifs gifs_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.gifs
    ADD CONSTRAINT gifs_pkey PRIMARY KEY ("gifId");


--
-- TOC entry 2724 (class 2606 OID 41100)
-- Name: feedComments primary_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."feedComments"
    ADD CONSTRAINT primary_key PRIMARY KEY (id);


--
-- TOC entry 2726 (class 2606 OID 41098)
-- Name: tags tags_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.tags
    ADD CONSTRAINT tags_pkey PRIMARY KEY (id);


--
-- TOC entry 2722 (class 2606 OID 24696)
-- Name: users user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_pkey PRIMARY KEY ("userId");


-- Completed on 2019-11-17 11:29:01

--
-- PostgreSQL database dump complete
--

