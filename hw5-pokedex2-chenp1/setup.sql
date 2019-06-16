--CSE 154 AL
--Parren Chen
--setup.sql code for hw5.

CREATE DATABASE hw5db;
USE hw5db;

CREATE TABLE Pokedex(
  name VARCHAR(30),
  nickname VARCHAR(30),
  datefound DATETIME,
  PRIMARY KEY(name)
);
