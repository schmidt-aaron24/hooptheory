/* eslint-disable */
import React, { useState, useEffect, useRef } from "react";
import { supabase } from "./supabase";

const HOF_PLAYERS = new Set([
  "Wilt Chamberlain","Bill Russell","Oscar Robertson","Jerry West","Elgin Baylor",
  "Kareem Abdul-Jabbar","Pete Maravich","Julius Erving","Rick Barry","Bill Walton",
  "Magic Johnson","Larry Bird","Michael Jordan","Charles Barkley","Hakeem Olajuwon",
  "Patrick Ewing","Karl Malone","John Stockton","David Robinson","Clyde Drexler",
  "Shaquille O'Neal","Kobe Bryant","Tim Duncan","Kevin Garnett","Allen Iverson",
  "Dirk Nowitzki","Dwyane Wade","Chris Paul","Carmelo Anthony",
  "Steve Nash","Ray Allen","Paul Pierce","Tracy McGrady",
  "Tiny Archibald","Elvin Hayes","Dave Cowens","Bob McAdoo","George Gervin",
  "Isiah Thomas","Dominique Wilkins","Gary Payton","Jason Kidd","Reggie Miller",
  "Scottie Pippen","Dennis Rodman","Bob Pettit","Lenny Wilkens","Walt Frazier",
  "Nate Thurmond","Bob Lanier","Dave Bing","Bob Dandridge","Gail Goodrich","Bernard King",
]);

const PLAYERS_RAW = [
  ["Wilt Chamberlain","Golden State Warriors","GSW","1960s","C",32.0,20.0,2.3,1.2,2.5],
  ["Paul Arizin","Golden State Warriors","GSW","1960s","SF|SG",26.4,9.0,2.3,1.2,0.6],
  ["Tom Gola","Golden State Warriors","GSW","1960s","SG|PG",14.7,9.4,5.6,1.4,0.2],
  ["Guy Rodgers","Golden State Warriors","GSW","1960s","PG",18.3,5.7,11.2,1.2,0.1],
  ["Al Attles","Golden State Warriors","GSW","1960s","PG|SG",11.0,3.7,3.7,1.2,0.1],
  ["Nate Thurmond","Golden State Warriors","GSW","1960s","C|PF",21.6,22.0,2.7,1.2,3.8],
  ["Jeff Mullins","Golden State Warriors","GSW","1960s","SG|PG",21.5,4.2,4.0,1.4,0.2],
  ["Rick Barry","Golden State Warriors","GSW","1960s","SF|SG",35.6,8.0,3.3,1.2,0.6],
  ["Cazzie Russell","Golden State Warriors","GSW","1960s","SG|SF",18.4,4.5,2.4,1.4,0.2],
  ["Bill Russell","Boston Celtics","BOS","1960s","C",16.2,22.5,4.3,1.5,4.8],
  ["Sam Jones","Boston Celtics","BOS","1960s","SG|PG",18.6,4.2,3.5,1.4,0.2],
  ["John Havlicek","Boston Celtics","BOS","1960s","SG|SF",19.5,6.0,4.0,1.4,0.2],
  ["Tom Heinsohn","Boston Celtics","BOS","1960s","SF|PF",22.1,9.4,2.6,1.2,0.6],
  ["Tom Sanders","Boston Celtics","BOS","1960s","PF|SF",13.7,8.3,1.4,1.0,1.0],
  ["K.C. Jones","Boston Celtics","BOS","1960s","PG",9.2,4.4,4.9,1.2,0.1],
  ["Bailey Howell","Boston Celtics","BOS","1960s","PF|SF",19.8,9.4,2.2,1.0,1.0],
  ["Jerry West","Los Angeles Lakers","LAL","1960s","PG|SG",27.0,4.8,6.6,1.2,0.1],
  ["Elgin Baylor","Los Angeles Lakers","LAL","1960s","SF|PF",30.6,14.9,4.1,1.2,0.6],
  ["Wilt Chamberlain","Los Angeles Lakers","LAL","1960s","C",27.0,17.0,4.1,1.2,2.5],
  ["Gail Goodrich","Los Angeles Lakers","LAL","1960s","PG|SG",23.8,5.4,6.4,1.2,0.1],
  ["Happy Hairston","Los Angeles Lakers","LAL","1960s","PF|C",15.3,13.7,1.8,1.0,1.0],
  ["Oscar Robertson","Sacramento Kings","SAC","1960s","PG|SG",29.3,10.8,10.0,1.2,0.1],
  ["Jerry Lucas","Sacramento Kings","SAC","1960s","C|PF",18.6,18.3,2.8,1.0,1.8],
  ["Jack Twyman","Sacramento Kings","SAC","1960s","SG|SF",25.3,7.2,2.4,1.4,0.2],
  ["Adrian Smith","Sacramento Kings","SAC","1960s","SG|PG",19.9,3.7,3.5,1.4,0.2],
  ["Tom Van Arsdale","Sacramento Kings","SAC","1960s","SF|SG",18.6,5.7,2.1,1.2,0.6],
  ["Willis Reed","New York Knicks","NYK","1960s","C|PF",21.7,13.7,1.8,1.0,1.8],
  ["Walt Bellamy","New York Knicks","NYK","1960s","C",23.8,15.1,2.0,1.0,1.8],
  ["Dick Barnett","New York Knicks","NYK","1960s","SG|PG",20.0,3.4,3.1,1.4,0.2],
  ["Dave DeBusschere","New York Knicks","NYK","1960s","PF|SF",16.3,13.5,2.5,1.0,1.0],
  ["Bill Bradley","New York Knicks","NYK","1960s","SF|SG",12.4,3.6,3.7,1.2,0.6],
  ["Wilt Chamberlain","Philadelphia 76ers","PHI","1960s","C",30.0,21.0,4.4,1.2,2.5],
  ["Hal Greer","Philadelphia 76ers","PHI","1960s","SG|PG",20.3,4.8,3.8,1.4,0.2],
  ["Billy Cunningham","Philadelphia 76ers","PHI","1960s","SF|PF",19.2,10.2,3.8,1.2,1.0],
  ["Chet Walker","Philadelphia 76ers","PHI","1960s","SF|SG",22.0,8.1,2.7,1.2,0.6],
  ["Wali Jones","Philadelphia 76ers","PHI","1960s","PG|SG",13.6,3.0,4.6,1.2,0.1],
  ["Dave Bing","Detroit Pistons","DET","1960s","PG|SG",27.1,4.5,6.4,1.2,0.1],
  ["Dave DeBusschere","Detroit Pistons","DET","1960s","PF|SF",16.0,14.8,2.4,1.0,1.0],
  ["Eddie Miles","Detroit Pistons","DET","1960s","SG|SF",18.1,4.4,2.6,1.4,0.2],
  ["Terry Dischinger","Detroit Pistons","DET","1960s","PF|SF",15.6,7.6,2.0,1.0,1.0],
  ["Jimmy Walker","Detroit Pistons","DET","1960s","PG|SG",21.7,3.8,5.5,1.2,0.1],
  ["Bob Pettit","Atlanta Hawks","ATL","1960s","PF|C",26.4,15.1,2.4,1.0,1.0],
  ["Cliff Hagan","Atlanta Hawks","ATL","1960s","SF|SG",22.7,7.7,3.5,1.2,0.6],
  ["Lenny Wilkens","Atlanta Hawks","ATL","1960s","PG|SG",20.0,6.7,8.3,1.2,0.1],
  ["Zelmo Beaty","Atlanta Hawks","ATL","1960s","C|PF",17.7,13.1,1.8,1.0,1.8],
  ["Bill Bridges","Atlanta Hawks","ATL","1960s","PF|C",12.0,15.3,3.0,1.0,1.0],
  ["Earl Monroe","Washington Wizards","WAS","1960s","SG|PG",21.4,3.8,4.0,1.4,0.2],
  ["Gus Johnson","Washington Wizards","WAS","1960s","PF|SF",20.1,14.7,2.3,1.0,1.0],
  ["Kevin Loughery","Washington Wizards","WAS","1960s","SG|PG",21.0,3.8,4.3,1.4,0.2],
  ["Jack Marin","Washington Wizards","WAS","1960s","SF|SG",18.3,5.8,2.1,1.2,0.6],
  ["Leroy Ellis","Washington Wizards","WAS","1960s","C|PF",10.7,12.1,1.2,1.0,1.8],
  ["Jerry Sloan","Chicago Bulls","CHI","1960s","SG|SF",17.0,8.1,2.5,1.4,0.2],
  ["Bob Boozer","Chicago Bulls","CHI","1960s","PF|C",18.0,9.8,1.5,1.0,1.0],
  ["Guy Rodgers","Chicago Bulls","CHI","1960s","PG",11.4,4.0,11.2,1.2,0.1],
  ["Clem Haskins","Chicago Bulls","CHI","1960s","SG|PG",14.9,4.0,3.1,1.4,0.2],
  ["Tom Boerwinkle","Chicago Bulls","CHI","1960s","C",8.1,11.0,4.0,1.0,1.8],
  ["Elvin Hayes","Houston Rockets","HOU","1960s","C|PF",28.4,17.1,1.5,1.0,1.8],
  ["Don Kojis","Houston Rockets","HOU","1960s","SF|SG",18.1,7.5,2.3,1.2,0.6],
  ["Stu Lantz","Houston Rockets","HOU","1960s","PG|SG",14.1,3.4,4.2,1.2,0.1],
  ["John Block","Houston Rockets","HOU","1960s","PF|C",12.9,8.1,1.6,1.0,1.0],
  ["Art Williams","Houston Rockets","HOU","1960s","PG",9.7,2.8,5.7,1.2,0.1],
  ["Gail Goodrich","Phoenix Suns","PHX","1960s","PG|SG",18.4,4.4,5.4,1.2,0.1],
  ["Dick Van Arsdale","Phoenix Suns","PHX","1960s","SF|SG",21.6,5.1,4.4,1.2,0.6],
  ["Connie Hawkins","Phoenix Suns","PHX","1960s","SF|PF",24.6,10.4,4.8,1.2,0.6],
  ["Paul Silas","Phoenix Suns","PHX","1960s","PF|C",11.0,13.4,2.2,1.0,1.0],
  ["Jim Fox","Phoenix Suns","PHX","1960s","C",11.5,9.8,1.5,1.0,1.8],
  ["Oscar Robertson","Sacramento Kings","SAC","1970s","PG|SG",25.3,6.1,8.1,0.8,0.0],
  ["Tiny Archibald","Sacramento Kings","SAC","1970s","PG",27.6,2.5,8.3,1.5,0.2],
  ["Tom Van Arsdale","Sacramento Kings","SAC","1970s","SF|SG",20.0,5.4,2.3,0.0,0.0],
  ["Ron Boone","Sacramento Kings","SAC","1970s","SG|PG",19.9,3.6,4.0,1.4,0.1],
  ["Otis Birdsong","Sacramento Kings","SAC","1970s","SG|SF",21.7,3.5,3.8,1.5,0.2],
  ["Jimmy Walker","Sacramento Kings","SAC","1970s","PG|SG",17.4,2.7,3.1,1.1,0.2],
  ["Brian Taylor","Sacramento Kings","SAC","1970s","PG",17.0,3.3,4.4,2.8,0.2],
  ["Sam Lacey","Sacramento Kings","SAC","1970s","C",12.9,12.4,3.7,1.3,1.8],
  ["Nate Williams","Sacramento Kings","SAC","1970s","SF|SG",16.3,5.1,2.5,1.5,0.3],
  ["Matt Guokas","Sacramento Kings","SAC","1970s","PG|SG",9.6,3.2,5.1,1.1,0.1],
  ["Kareem Abdul-Jabbar","Milwaukee Bucks","MIL","1970s","C",30.4,14.5,4.1,1.3,3.5],
  ["Oscar Robertson","Milwaukee Bucks","MIL","1970s","PG|SG",19.4,5.7,8.2,1.1,0.1],
  ["Bob Dandridge","Milwaukee Bucks","MIL","1970s","SF|PF",17.6,6.8,3.2,1.3,0.8],
  ["Jon McGlocklin","Milwaukee Bucks","MIL","1970s","SG",16.0,2.8,2.8,0.7,0.1],
  ["Junior Bridgeman","Milwaukee Bucks","MIL","1970s","SG|SF",17.8,3.9,3.0,1.0,0.3],
  ["Dave Cowens","Boston Celtics","BOS","1970s","C|PF",18.9,14.8,3.9,0.8,1.0],
  ["John Havlicek","Boston Celtics","BOS","1970s","SG|SF",23.4,6.5,6.3,1.4,0.3],
  ["Jo Jo White","Boston Celtics","BOS","1970s","PG|SG",18.6,4.3,4.9,1.2,0.2],
  ["Paul Silas","Boston Celtics","BOS","1970s","PF|C",11.2,13.4,2.8,1.0,0.4],
  ["Charlie Scott","Boston Celtics","BOS","1970s","SG|PG",17.6,3.9,4.5,1.5,0.3],
  ["Rick Barry","Golden State Warriors","GSW","1970s","SF|SG",25.8,5.5,5.0,2.4,0.4],
  ["Nate Thurmond","Golden State Warriors","GSW","1970s","C|PF",15.1,17.7,3.2,0.9,1.5],
  ["Jamaal Wilkes","Golden State Warriors","GSW","1970s","SF|PF",14.2,8.5,2.1,1.4,0.4],
  ["World B. Free","Golden State Warriors","GSW","1970s","SG|PG",23.9,3.9,4.9,1.2,0.3],
  ["Phil Smith","Golden State Warriors","GSW","1970s","SG|PG",20.0,3.8,4.2,1.5,0.3],
  ["Kareem Abdul-Jabbar","Los Angeles Lakers","LAL","1970s","C",27.0,13.5,4.0,1.2,3.4],
  ["Gail Goodrich","Los Angeles Lakers","LAL","1970s","PG|SG",21.5,3.0,4.5,1.4,0.2],
  ["Jerry West","Los Angeles Lakers","LAL","1970s","PG|SG",24.8,4.0,8.1,1.7,0.2],
  ["Happy Hairston","Los Angeles Lakers","LAL","1970s","PF|C",13.5,13.3,1.5,0.6,0.4],
  ["Cazzie Russell","Los Angeles Lakers","LAL","1970s","SG|SF",13.7,3.6,1.6,0.6,0.2],
  ["Walt Frazier","New York Knicks","NYK","1970s","PG|SG",18.9,5.5,6.4,1.7,0.3],
  ["Earl Monroe","New York Knicks","NYK","1970s","SG|PG",20.7,3.3,4.4,1.3,0.2],
  ["Willis Reed","New York Knicks","NYK","1970s","C|PF",20.0,13.5,2.0,0.5,0.5],
  ["Dave DeBusschere","New York Knicks","NYK","1970s","PF|SF",18.1,11.1,3.1,0.9,0.5],
  ["Spencer Haywood","New York Knicks","NYK","1970s","PF|C",23.4,12.1,1.9,0.9,1.2],
  ["Julius Erving","Philadelphia 76ers","PHI","1970s","SF|PF",23.1,7.5,3.7,1.9,1.4],
  ["Doug Collins","Philadelphia 76ers","PHI","1970s","SG|PG",20.8,3.5,4.0,1.5,0.2],
  ["George McGinnis","Philadelphia 76ers","PHI","1970s","PF|SF",18.6,10.2,3.8,1.8,1.2],
  ["World B. Free","Philadelphia 76ers","PHI","1970s","SG|PG",20.0,3.2,4.3,1.0,0.2],
  ["Caldwell Jones","Philadelphia 76ers","PHI","1970s","C|PF",8.5,10.2,1.4,0.8,3.1],
  ["Calvin Murphy","Houston Rockets","HOU","1970s","PG",22.8,2.5,4.6,1.4,0.1],
  ["Rudy Tomjanovich","Houston Rockets","HOU","1970s","SF|PF",24.5,9.1,1.8,0.8,0.4],
  ["Moses Malone","Houston Rockets","HOU","1970s","C",21.4,14.8,1.2,0.8,1.5],
  ["Mike Newlin","Houston Rockets","HOU","1970s","SG|PG",19.2,3.9,4.8,1.5,0.3],
  ["Elvin Hayes","Houston Rockets","HOU","1970s","C|PF",24.8,15.0,1.8,1.0,2.3],
  ["Bill Walton","Portland Trail Blazers","POR","1970s","C",18.9,14.4,5.0,0.9,3.4],
  ["Maurice Lucas","Portland Trail Blazers","POR","1970s","PF|SF",20.2,11.4,3.4,1.3,0.7],
  ["Lionel Hollins","Portland Trail Blazers","POR","1970s","PG|SG",16.0,3.3,6.3,2.6,0.4],
  ["Bob Gross","Portland Trail Blazers","POR","1970s","SF|SG",14.2,5.9,3.8,1.6,0.5],
  ["Dave Twardzik","Portland Trail Blazers","POR","1970s","PG",11.1,2.9,4.6,2.3,0.1],
  ["George Gervin","San Antonio Spurs","SAS","1970s","SG|SF",27.4,4.8,2.7,1.5,0.7],
  ["James Silas","San Antonio Spurs","SAS","1970s","PG",16.8,3.0,5.2,1.4,0.2],
  ["Larry Kenon","San Antonio Spurs","SAS","1970s","PF|SF",22.1,11.4,2.8,2.1,0.6],
  ["Billy Paultz","San Antonio Spurs","SAS","1970s","C",15.3,10.1,2.7,0.8,1.4],
  ["Alvin Robertson","San Antonio Spurs","SAS","1970s","SG|PG",11.0,4.2,3.9,2.1,0.5],
  ["David Thompson","Denver Nuggets","DEN","1970s","SG|SF",22.1,4.2,3.2,1.3,0.6],
  ["Dan Issel","Denver Nuggets","DEN","1970s","C|PF",21.8,9.5,2.8,0.8,0.8],
  ["Bobby Jones","Denver Nuggets","DEN","1970s","SF|PF",14.3,7.4,2.8,1.8,1.5],
  ["Mack Calvin","Denver Nuggets","DEN","1970s","PG",16.3,2.8,8.3,1.5,0.1],
  ["Ralph Simpson","Denver Nuggets","DEN","1970s","SG|PG",18.2,3.9,4.5,1.2,0.3],
  ["Paul Westphal","Phoenix Suns","PHX","1970s","PG|SG",21.8,3.4,5.0,1.6,0.3],
  ["Walter Davis","Phoenix Suns","PHX","1970s","SG|SF",24.8,4.4,4.2,1.4,0.4],
  ["Alvan Adams","Phoenix Suns","PHX","1970s","C|PF",19.5,10.4,5.1,1.6,1.0],
  ["Truck Robinson","Phoenix Suns","PHX","1970s","PF|C",23.8,4.4,4.2,1.4,0.4],
  ["Don Buse","Phoenix Suns","PHX","1970s","PG",16.2,8.8,4.2,1.4,0.8],
  ["Elvin Hayes","Washington Wizards","WAS","1970s","C|PF",21.8,15.0,2.0,1.0,2.5],
  ["Bob Dandridge","Washington Wizards","WAS","1970s","SF|PF",19.3,7.5,4.5,1.6,0.7],
  ["Phil Chenier","Washington Wizards","WAS","1970s","SG|PG",21.3,3.7,3.8,1.7,0.3],
  ["Kevin Porter","Washington Wizards","WAS","1970s","PG",16.0,5.0,8.0,1.7,0.2],
  ["Wes Unseld","Washington Wizards","WAS","1970s","C",11.2,14.8,3.1,0.8,1.0],
  ["Pete Maravich","Utah Jazz","UTA","1970s","PG|SG",25.2,3.8,5.8,1.3,0.2],
  ["Truck Robinson","Utah Jazz","UTA","1970s","PF|C",22.7,15.7,2.8,0.9,0.7],
  ["Gail Goodrich","Utah Jazz","UTA","1970s","PG|SG",19.0,3.4,5.1,1.2,0.2],
  ["Rich Kelley","Utah Jazz","UTA","1970s","C",10.4,10.9,3.7,0.7,1.1],
  ["Bob Lanier","Detroit Pistons","DET","1970s","C",23.2,12.5,3.0,0.8,2.1],
  ["Dave Bing","Detroit Pistons","DET","1970s","PG|SG",22.8,4.2,5.6,0.8,0.2],
  ["Chris Ford","Detroit Pistons","DET","1970s","SG|PG",13.1,3.4,4.2,1.4,0.3],
  ["Eric Money","Detroit Pistons","DET","1970s","PG",14.7,2.9,5.2,1.2,0.1],
  ["Curtis Rowe","Detroit Pistons","DET","1970s","PF|SF",21.2,3.8,4.6,1.2,0.1],
  ["Lou Hudson","Atlanta Hawks","ATL","1970s","SG|SF",26.8,5.0,3.9,1.1,0.3],
  ["Pete Maravich","Atlanta Hawks","ATL","1970s","PG|SG",23.2,4.4,4.5,1.2,0.1],
  ["John Drew","Atlanta Hawks","ATL","1970s","SF|PF",22.8,7.4,2.2,1.3,0.6],
  ["Dan Roundfield","Atlanta Hawks","ATL","1970s","PF|C",16.1,11.6,2.5,1.5,2.5],
  ["Bob McAdoo","Los Angeles Clippers","LAC","1970s","C|PF",27.2,12.4,3.0,0.7,1.8],
  ["Randy Smith","Los Angeles Clippers","LAC","1970s","SG|PG",18.4,4.2,5.2,1.6,0.2],
  ["Adrian Dantley","Los Angeles Clippers","LAC","1970s","SF|SG",20.3,7.6,2.0,1.2,0.5],
  ["Ernie DiGregorio","Los Angeles Clippers","LAC","1970s","PG",15.3,3.2,8.4,1.1,0.0],
  ["Jim McMillian","Los Angeles Clippers","LAC","1970s","SF|SG",19.7,5.5,2.6,0.8,0.3],
  ["Mel Daniels","Indiana Pacers","IND","1970s","C|PF",19.0,16.2,2.9,0.8,1.4],
  ["Billy Keller","Indiana Pacers","IND","1970s","PG",13.1,3.2,5.8,1.1,0.1],
  ["Don Buse","Indiana Pacers","IND","1970s","PG",12.0,4.3,8.5,3.5,0.3],
  ["Roger Brown","Indiana Pacers","IND","1970s","SF|SG",15.8,5.5,2.9,0.8,0.3],
  ["Bob Netolicky","Indiana Pacers","IND","1970s","PF|C",15.1,10.6,2.1,0.7,0.6],
  ["Michael Jordan","Chicago Bulls","CHI","1980s","SG|SF",31.5,5.5,5.5,2.9,1.4],
  ["Scottie Pippen","Chicago Bulls","CHI","1980s","SF|PF|SG",16.8,7.2,5.2,2.1,1.0],
  ["Horace Grant","Chicago Bulls","CHI","1980s","PF|SF",14.2,9.4,3.3,1.4,1.2],
  ["Bill Cartwright","Chicago Bulls","CHI","1980s","C",12.4,6.7,1.4,0.5,0.9],
  ["John Paxson","Chicago Bulls","CHI","1980s","PG|SG",9.5,2.0,4.2,0.9,0.1],
  ["Orlando Woolridge","Chicago Bulls","CHI","1980s","SF|SG",22.0,5.3,1.6,0.9,0.6],
  ["Magic Johnson","Los Angeles Lakers","LAL","1980s","PG|SF",21.5,7.0,11.4,1.9,0.4],
  ["Kareem Abdul-Jabbar","Los Angeles Lakers","LAL","1980s","C",24.8,10.2,3.2,1.0,2.2],
  ["James Worthy","Los Angeles Lakers","LAL","1980s","SF|PF",19.6,5.4,2.8,1.3,0.9],
  ["Byron Scott","Los Angeles Lakers","LAL","1980s","SG|SF",21.7,3.6,3.5,1.7,0.2],
  ["Michael Cooper","Los Angeles Lakers","LAL","1980s","SG|SF",10.9,3.2,5.0,1.5,0.4],
  ["A.C. Green","Los Angeles Lakers","LAL","1980s","PF|C",12.6,9.4,1.4,0.9,0.5],
  ["Larry Bird","Boston Celtics","BOS","1980s","SF|PF",26.4,9.5,6.8,1.8,0.7],
  ["Kevin McHale","Boston Celtics","BOS","1980s","PF|C",20.8,8.8,2.2,0.6,1.7],
  ["Robert Parish","Boston Celtics","BOS","1980s","C",16.8,9.8,1.8,0.9,1.3],
  ["Dennis Johnson","Boston Celtics","BOS","1980s","PG|SG",16.2,4.0,7.9,1.7,0.5],
  ["Danny Ainge","Boston Celtics","BOS","1980s","PG|SG",14.6,3.6,5.2,1.5,0.1],
  ["Bill Walton","Boston Celtics","BOS","1980s","C|PF",8.0,7.0,2.7,0.8,1.3],
  ["Isiah Thomas","Detroit Pistons","DET","1980s","PG",19.2,3.8,10.8,1.9,0.3],
  ["Joe Dumars","Detroit Pistons","DET","1980s","SG|PG",17.4,2.8,4.6,1.1,0.2],
  ["Bill Laimbeer","Detroit Pistons","DET","1980s","C|PF",13.2,11.8,2.2,0.6,1.2],
  ["Dennis Rodman","Detroit Pistons","DET","1980s","PF|SF",9.2,14.5,2.0,0.7,0.6],
  ["Mark Aguirre","Detroit Pistons","DET","1980s","SF|PF",18.9,5.1,2.6,0.9,0.5],
  ["Vinnie Johnson","Detroit Pistons","DET","1980s","SG|PG",15.5,3.4,3.7,0.9,0.3],
  ["Charles Barkley","Philadelphia 76ers","PHI","1980s","PF|C",24.6,12.8,3.2,1.6,1.0],
  ["Julius Erving","Philadelphia 76ers","PHI","1980s","SF|PF",22.2,6.2,3.6,1.7,1.2],
  ["Moses Malone","Philadelphia 76ers","PHI","1980s","C",22.8,12.8,1.4,0.7,1.2],
  ["Andrew Toney","Philadelphia 76ers","PHI","1980s","SG|PG",19.7,2.7,4.9,1.4,0.3],
  ["Maurice Cheeks","Philadelphia 76ers","PHI","1980s","PG",13.8,3.6,7.2,2.3,0.2],
  ["Hakeem Olajuwon","Houston Rockets","HOU","1980s","C",22.4,12.0,2.4,2.0,3.1],
  ["Ralph Sampson","Houston Rockets","HOU","1980s","C|PF",18.8,9.8,2.6,0.9,2.1],
  ["Otis Thorpe","Houston Rockets","HOU","1980s","PF|C",18.1,10.2,2.4,0.9,1.2],
  ["Lewis Lloyd","Houston Rockets","HOU","1980s","SG|SF",18.6,4.9,2.8,1.0,0.3],
  ["Rodney McCray","Houston Rockets","HOU","1980s","SF|PF",10.7,6.3,3.4,1.0,0.5],
  ["Karl Malone","Utah Jazz","UTA","1980s","PF|C",25.8,10.2,2.8,1.3,0.9],
  ["John Stockton","Utah Jazz","UTA","1980s","PG",14.2,2.8,12.6,2.8,0.2],
  ["Mark Eaton","Utah Jazz","UTA","1980s","C",6.4,10.8,0.9,0.3,5.6],
  ["Darrell Griffith","Utah Jazz","UTA","1980s","SG",22.6,3.8,3.0,1.1,0.5],
  ["Thurl Bailey","Utah Jazz","UTA","1980s","SF|PF",19.1,7.2,1.5,0.7,1.2],
  ["Clyde Drexler","Portland Trail Blazers","POR","1980s","SG|SF",24.4,6.8,5.8,2.4,0.6],
  ["Terry Porter","Portland Trail Blazers","POR","1980s","PG",15.6,3.4,8.0,1.4,0.2],
  ["Jerome Kersey","Portland Trail Blazers","POR","1980s","SF|PF",19.2,7.5,2.8,1.5,0.7],
  ["Kevin Duckworth","Portland Trail Blazers","POR","1980s","C",18.1,7.9,1.4,0.5,1.0],
  ["Buck Williams","Portland Trail Blazers","POR","1980s","PF|C",12.8,10.0,1.7,0.9,1.1],
  ["Dominique Wilkins","Atlanta Hawks","ATL","1980s","SF|SG",28.2,6.4,2.5,1.2,0.5],
  ["Doc Rivers","Atlanta Hawks","ATL","1980s","PG|SG",14.2,4.3,7.0,2.0,0.3],
  ["Kevin Willis","Atlanta Hawks","ATL","1980s","PF|C",17.7,11.2,1.2,0.7,0.8],
  ["Jon Koncak","Atlanta Hawks","ATL","1980s","C",5.2,6.5,0.9,0.7,2.1],
  ["Randy Wittman","Atlanta Hawks","ATL","1980s","SG|PG",13.0,2.8,3.3,0.9,0.1],
  ["David Robinson","San Antonio Spurs","SAS","1980s","C",26.4,11.2,2.6,1.6,3.6],
  ["George Gervin","San Antonio Spurs","SAS","1980s","SG|SF",28.8,5.0,2.8,1.5,0.7],
  ["Alvin Robertson","San Antonio Spurs","SAS","1980s","SG|PG",17.0,6.3,6.8,3.7,0.7],
  ["Terry Cummings","San Antonio Spurs","SAS","1980s","PF|SF",22.0,8.9,2.3,1.0,0.7],
  ["Willie Anderson","San Antonio Spurs","SAS","1980s","SG|SF",16.0,4.5,5.1,1.4,0.6],
  ["Patrick Ewing","New York Knicks","NYK","1980s","C",24.2,9.8,2.0,1.3,3.1],
  ["Mark Jackson","New York Knicks","NYK","1980s","PG",11.8,4.2,9.4,1.5,0.2],
  ["Bernard King","New York Knicks","NYK","1980s","SF|SG",32.9,5.9,3.5,1.2,0.5],
  ["Gerald Wilkins","New York Knicks","NYK","1980s","SG|SF",17.1,3.8,3.3,1.3,0.4],
  ["Charles Oakley","New York Knicks","NYK","1980s","PF|C",12.1,13.0,3.2,1.0,0.4],
  ["Michael Jordan","Chicago Bulls","CHI","1990s","SG|SF",30.4,6.2,5.4,2.3,0.8],
  ["Scottie Pippen","Chicago Bulls","CHI","1990s","SF|PF|SG",18.8,7.8,5.4,2.2,1.0],
  ["Dennis Rodman","Chicago Bulls","CHI","1990s","PF|SF",5.8,17.3,2.1,0.6,0.6],
  ["Toni Kukoč","Chicago Bulls","CHI","1990s","SF|SG",15.7,4.8,4.0,1.1,0.6],
  ["Ron Harper","Chicago Bulls","CHI","1990s","SG|PG",9.1,3.5,2.9,1.2,0.4],
  ["Luc Longley","Chicago Bulls","CHI","1990s","C",9.5,5.3,2.1,0.4,0.9],
  ["Gary Payton","Oklahoma City Thunder","OKC","1990s","PG|SG",20.6,4.2,8.2,2.7,0.3],
  ["Shawn Kemp","Oklahoma City Thunder","OKC","1990s","PF|C",18.8,10.2,2.5,1.0,1.6],
  ["Detlef Schrempf","Oklahoma City Thunder","OKC","1990s","PF|SF",19.9,8.1,4.2,0.9,0.5],
  ["Hersey Hawkins","Oklahoma City Thunder","OKC","1990s","SG|SF",15.6,3.5,3.4,1.8,0.2],
  ["Sam Perkins","Oklahoma City Thunder","OKC","1990s","PF|C",13.3,6.9,1.8,0.7,1.2],
  ["Nate McMillan","Oklahoma City Thunder","OKC","1990s","PG",7.3,5.0,7.6,2.2,0.4],
  ["Hakeem Olajuwon","Houston Rockets","HOU","1990s","C",26.8,11.2,3.4,1.8,3.4],
  ["Clyde Drexler","Houston Rockets","HOU","1990s","SG|SF",19.8,6.2,5.0,1.7,0.5],
  ["Charles Barkley","Houston Rockets","HOU","1990s","PF|C",18.4,11.4,3.8,1.4,0.8],
  ["Kenny Smith","Houston Rockets","HOU","1990s","PG",14.5,2.6,6.2,1.0,0.1],
  ["Vernon Maxwell","Houston Rockets","HOU","1990s","SG|PG",17.0,3.6,4.6,1.8,0.4],
  ["Mario Elie","Houston Rockets","HOU","1990s","SG|SF",11.1,3.2,3.5,1.4,0.3],
  ["Karl Malone","Utah Jazz","UTA","1990s","PF|C",27.2,10.4,3.8,1.4,0.9],
  ["John Stockton","Utah Jazz","UTA","1990s","PG",15.8,2.8,12.8,2.9,0.2],
  ["Jeff Hornacek","Utah Jazz","UTA","1990s","SG|PG",17.7,3.5,5.0,1.7,0.3],
  ["Bryon Russell","Utah Jazz","UTA","1990s","SF|SG",10.4,3.8,1.9,1.1,0.3],
  ["Greg Ostertag","Utah Jazz","UTA","1990s","C",5.0,7.0,0.7,0.4,2.0],
  ["Charles Barkley","Phoenix Suns","PHX","1990s","PF|C",24.2,11.4,4.6,1.7,0.9],
  ["Kevin Johnson","Phoenix Suns","PHX","1990s","PG",18.8,3.6,10.8,1.6,0.2],
  ["Dan Majerle","Phoenix Suns","PHX","1990s","SG|SF",17.7,5.1,3.6,1.5,0.3],
  ["Cedric Ceballos","Phoenix Suns","PHX","1990s","SF|PF",25.0,7.4,1.9,0.8,0.5],
  ["Danny Manning","Phoenix Suns","PHX","1990s","SF|PF",17.8,6.7,2.8,1.3,1.2],
  ["Patrick Ewing","New York Knicks","NYK","1990s","C",23.2,10.8,2.2,1.4,2.6],
  ["John Starks","New York Knicks","NYK","1990s","SG|PG",17.5,3.0,4.4,1.9,0.3],
  ["Charles Oakley","New York Knicks","NYK","1990s","PF|C",11.0,11.5,3.0,1.0,0.3],
  ["Larry Johnson","New York Knicks","NYK","1990s","PF|SF",16.2,6.2,2.8,0.9,0.8],
  ["Allan Houston","New York Knicks","NYK","1990s","SG",21.8,3.7,3.5,0.9,0.2],
  ["David Robinson","San Antonio Spurs","SAS","1990s","C",27.2,11.2,2.8,1.7,3.8],
  ["Tim Duncan","San Antonio Spurs","SAS","1990s","PF|C",21.2,11.4,2.6,0.8,2.4],
  ["Avery Johnson","San Antonio Spurs","SAS","1990s","PG",16.7,2.8,6.9,1.5,0.2],
  ["Sean Elliott","San Antonio Spurs","SAS","1990s","SG|SF",20.0,4.3,3.4,1.3,0.4],
  ["Vinny Del Negro","San Antonio Spurs","SAS","1990s","SG|PG",12.5,2.5,3.9,0.9,0.1],
  ["Shaquille O'Neal","Orlando Magic","ORL","1990s","C",27.2,12.4,2.4,0.6,2.5],
  ["Anfernee Hardaway","Orlando Magic","ORL","1990s","PG|SG",18.4,4.2,6.4,1.7,0.8],
  ["Nick Anderson","Orlando Magic","ORL","1990s","SG|SF",15.0,4.9,2.8,1.5,0.4],
  ["Horace Grant","Orlando Magic","ORL","1990s","PF|SF",12.5,9.8,3.0,1.1,1.1],
  ["Dennis Scott","Orlando Magic","ORL","1990s","SF|SG",15.8,3.7,1.9,0.7,0.2],
  ["Reggie Miller","Indiana Pacers","IND","1990s","SG|SF",20.4,2.8,2.8,1.2,0.2],
  ["Rik Smits","Indiana Pacers","IND","1990s","C",18.5,7.2,1.6,0.4,1.4],
  ["Mark Jackson","Indiana Pacers","IND","1990s","PG",11.5,4.0,10.2,1.2,0.1],
  ["Chris Mullin","Indiana Pacers","IND","1990s","SF|SG",16.6,4.4,3.1,1.3,0.4],
  ["Dale Davis","Indiana Pacers","IND","1990s","PF|C",9.4,10.0,0.8,0.6,1.4],
  ["Mitch Richmond","Sacramento Kings","SAC","1990s","SG",22.0,3.4,3.4,1.5,0.2],
  ["Spud Webb","Sacramento Kings","SAC","1990s","PG",14.8,2.6,7.9,1.6,0.1],
  ["Lionel Simmons","Sacramento Kings","SAC","1990s","SF|PF",18.8,8.1,4.3,1.2,0.9],
  ["Wayman Tisdale","Sacramento Kings","SAC","1990s","PF|C",22.3,7.4,1.5,0.7,0.6],
  ["Vin Baker","Milwaukee Bucks","MIL","1990s","PF|C",18.8,7.8,2.8,1.4,0.8],
  ["Ray Allen","Milwaukee Bucks","MIL","1990s","SG|SF",18.4,4.0,3.8,1.3,0.3],
  ["Glenn Robinson","Milwaukee Bucks","MIL","1990s","SF|PF",19.6,5.8,2.4,0.9,0.4],
  ["Terrell Brandon","Milwaukee Bucks","MIL","1990s","PG",17.2,3.4,7.2,1.8,0.1],
  ["Kobe Bryant","Los Angeles Lakers","LAL","2000s","SG|SF",27.9,5.4,5.0,1.6,0.4],
  ["Shaquille O'Neal","Los Angeles Lakers","LAL","2000s","C",27.2,11.8,3.0,0.6,2.2],
  ["Derek Fisher","Los Angeles Lakers","LAL","2000s","PG",11.9,2.8,3.9,0.9,0.1],
  ["Rick Fox","Los Angeles Lakers","LAL","2000s","SF|SG",12.1,4.8,3.4,1.0,0.5],
  ["Pau Gasol","Los Angeles Lakers","LAL","2000s","PF|C",18.8,9.7,3.5,0.6,1.7],
  ["LeBron James","Cleveland Cavaliers","CLE","2000s","PG|SG|SF|PF",27.8,7.2,7.6,1.7,0.9],
  ["Mo Williams","Cleveland Cavaliers","CLE","2000s","PG",17.8,3.4,5.2,1.0,0.1],
  ["Zydrunas Ilgauskas","Cleveland Cavaliers","CLE","2000s","C",16.2,8.0,1.4,0.4,2.0],
  ["Larry Hughes","Cleveland Cavaliers","CLE","2000s","SG|SF",16.3,4.8,3.5,2.4,0.5],
  ["Drew Gooden","Cleveland Cavaliers","CLE","2000s","PF|C",12.8,9.0,1.1,0.6,0.7],
  ["Dwyane Wade","Miami Heat","MIA","2000s","PG|SG",28.8,5.2,7.0,2.0,1.0],
  ["Shaquille O'Neal","Miami Heat","MIA","2000s","C",20.4,9.6,2.4,0.5,2.0],
  ["Alonzo Mourning","Miami Heat","MIA","2000s","C",13.5,8.4,0.8,0.5,2.4],
  ["Jason Williams","Miami Heat","MIA","2000s","PG",10.1,2.6,5.5,0.8,0.1],
  ["Antoine Walker","Miami Heat","MIA","2000s","PF|SF",15.6,7.0,3.7,0.8,0.5],
  ["Dirk Nowitzki","Dallas Mavericks","DAL","2000s","PF|C",26.8,8.2,2.8,0.6,0.8],
  ["Jason Terry","Dallas Mavericks","DAL","2000s","SG|PG",17.5,2.7,4.5,1.1,0.2],
  ["Michael Finley","Dallas Mavericks","DAL","2000s","SG|SF",21.9,4.4,3.7,1.2,0.5],
  ["Steve Nash","Dallas Mavericks","DAL","2000s","PG",15.8,3.2,9.8,0.7,0.1],
  ["Antawn Jamison","Dallas Mavericks","DAL","2000s","PF|SF",19.8,8.5,1.9,0.8,0.4],
  ["Steve Nash","Phoenix Suns","PHX","2000s","PG",16.2,3.2,10.2,0.7,0.1],
  ["Amar'e Stoudemire","Phoenix Suns","PHX","2000s","PF|C",22.8,9.2,1.6,0.8,1.2],
  ["Shawn Marion","Phoenix Suns","PHX","2000s","SF|PF",18.4,9.8,2.2,1.9,1.2],
  ["Leandro Barbosa","Phoenix Suns","PHX","2000s","PG|SG",18.1,2.4,3.8,0.9,0.2],
  ["Raja Bell","Phoenix Suns","PHX","2000s","SG|SF",13.7,3.7,2.7,1.5,0.4],
  ["Allen Iverson","Philadelphia 76ers","PHI","2000s","PG|SG",29.6,3.6,6.8,2.3,0.2],
  ["Dikembe Mutombo","Philadelphia 76ers","PHI","2000s","C",8.9,12.6,1.0,0.5,3.0],
  ["Aaron McKie","Philadelphia 76ers","PHI","2000s","SG|PG",10.6,4.0,4.3,1.6,0.3],
  ["Keith Van Horn","Philadelphia 76ers","PHI","2000s","PF|SF",16.5,7.3,1.8,0.6,0.6],
  ["Eric Snow","Philadelphia 76ers","PHI","2000s","PG",9.4,3.3,6.5,1.5,0.2],
  ["Tim Duncan","San Antonio Spurs","SAS","2000s","PF|C",23.2,11.8,3.2,0.8,2.6],
  ["Tony Parker","San Antonio Spurs","SAS","2000s","PG",17.8,3.2,6.2,0.7,0.1],
  ["Manu Ginobili","San Antonio Spurs","SAS","2000s","SG|PG",16.4,3.8,4.8,1.4,0.3],
  ["Bruce Bowen","San Antonio Spurs","SAS","2000s","SF|SG",8.5,3.3,1.4,1.7,0.4],
  ["Robert Horry","San Antonio Spurs","SAS","2000s","PF|SF",6.4,5.2,2.0,0.9,0.9],
  ["Chauncey Billups","Detroit Pistons","DET","2000s","PG",17.8,3.2,7.8,1.2,0.2],
  ["Richard Hamilton","Detroit Pistons","DET","2000s","SG|SF",18.2,3.4,3.6,0.9,0.2],
  ["Rasheed Wallace","Detroit Pistons","DET","2000s","PF|C",14.9,7.3,2.0,0.8,1.5],
  ["Ben Wallace","Detroit Pistons","DET","2000s","C|PF",7.8,13.2,1.6,1.4,3.2],
  ["Tayshaun Prince","Detroit Pistons","DET","2000s","SF|SG",14.5,5.3,3.1,1.3,1.4],
  ["Kevin Garnett","Minnesota Timberwolves","MIN","2000s","PF|C",22.4,12.8,4.6,1.4,2.0],
  ["Stephon Marbury","Minnesota Timberwolves","MIN","2000s","PG",21.3,3.5,8.9,1.2,0.2],
  ["Latrell Sprewell","Minnesota Timberwolves","MIN","2000s","SG|SF",16.8,4.2,3.0,1.3,0.5],
  ["Sam Cassell","Minnesota Timberwolves","MIN","2000s","PG",19.8,3.2,7.3,1.2,0.2],
  ["Tracy McGrady","Orlando Magic","ORL","2000s","SG|SF",28.4,6.8,4.8,1.6,1.0],
  ["Grant Hill","Orlando Magic","ORL","2000s","SF|SG",19.7,6.5,5.4,1.1,0.7],
  ["Darrell Armstrong","Orlando Magic","ORL","2000s","PG",12.1,3.1,5.6,1.8,0.2],
  ["Mike Miller","Orlando Magic","ORL","2000s","SF|SG",14.8,5.0,3.2,0.9,0.3],
  ["Carmelo Anthony","Denver Nuggets","DEN","2000s","SF|PF",26.8,6.3,2.8,1.0,0.5],
  ["Allen Iverson","Denver Nuggets","DEN","2000s","PG|SG",24.4,3.6,8.2,2.0,0.2],
  ["Marcus Camby","Denver Nuggets","DEN","2000s","C|PF",9.9,15.6,1.6,0.9,3.7],
  ["Andre Miller","Denver Nuggets","DEN","2000s","PG",16.0,4.8,10.0,1.4,0.1],
  ["Paul Pierce","Boston Celtics","BOS","2000s","SF|PF",24.2,6.4,4.0,1.3,0.7],
  ["Ray Allen","Boston Celtics","BOS","2000s","SG|SF",19.4,3.6,2.9,1.0,0.2],
  ["Kevin Garnett","Boston Celtics","BOS","2000s","PF|C",16.8,8.4,3.2,0.9,1.2],
  ["Rajon Rondo","Boston Celtics","BOS","2000s","PG",11.0,5.0,8.2,2.5,0.4],
  ["Kendrick Perkins","Boston Celtics","BOS","2000s","C",7.2,7.0,0.9,0.5,1.3],
  ["LeBron James","Miami Heat","MIA","2010s","PG|SG|SF|PF",26.4,7.8,6.2,1.6,0.8],
  ["Dwyane Wade","Miami Heat","MIA","2010s","PG|SG",21.8,4.6,4.2,1.6,0.8],
  ["Chris Bosh","Miami Heat","MIA","2010s","PF|C",18.6,7.0,2.0,0.8,1.0],
  ["Ray Allen","Miami Heat","MIA","2010s","SG|SF",10.9,2.6,1.7,0.7,0.1],
  ["Mario Chalmers","Miami Heat","MIA","2010s","PG",10.2,3.0,4.4,1.5,0.2],
  ["Kevin Durant","Oklahoma City Thunder","OKC","2010s","SF|PF",29.2,7.6,3.2,1.2,1.1],
  ["Russell Westbrook","Oklahoma City Thunder","OKC","2010s","PG|SG",26.8,8.8,9.2,1.5,0.4],
  ["James Harden","Oklahoma City Thunder","OKC","2010s","SG|PG",17.0,4.0,5.0,1.5,0.5],
  ["Serge Ibaka","Oklahoma City Thunder","OKC","2010s","PF|C",15.9,7.2,1.0,0.6,3.7],
  ["Paul George","Oklahoma City Thunder","OKC","2010s","SF|SG",28.0,8.2,4.1,2.2,0.7],
  ["Stephen Curry","Golden State Warriors","GSW","2010s","PG|SG",28.4,5.0,6.4,2.0,0.2],
  ["Kevin Durant","Golden State Warriors","GSW","2010s","SF|PF",24.2,7.4,4.8,1.0,1.0],
  ["Klay Thompson","Golden State Warriors","GSW","2010s","SG|SF",20.2,3.6,2.0,1.1,0.5],
  ["Draymond Green","Golden State Warriors","GSW","2010s","PF|C|SF",9.8,7.4,6.8,1.5,1.1],
  ["Andre Iguodala","Golden State Warriors","GSW","2010s","SF|SG",7.6,4.3,4.0,1.4,0.8],
  ["James Harden","Houston Rockets","HOU","2010s","SG|PG",32.8,6.2,7.2,1.7,0.7],
  ["Chris Paul","Houston Rockets","HOU","2010s","PG",16.8,4.6,8.6,1.9,0.3],
  ["Clint Capela","Houston Rockets","HOU","2010s","C",16.6,12.7,1.1,0.9,2.0],
  ["Eric Gordon","Houston Rockets","HOU","2010s","SG|PG",18.4,2.8,2.6,0.7,0.3],
  ["Ryan Anderson","Houston Rockets","HOU","2010s","PF|SF",14.1,5.5,1.2,0.4,0.5],
  ["Giannis Antetokounmpo","Milwaukee Bucks","MIL","2010s","PF|SF|C",26.4,11.2,5.4,1.4,1.4],
  ["Khris Middleton","Milwaukee Bucks","MIL","2010s","SF|PF",20.8,6.0,4.3,1.3,0.3],
  ["Eric Bledsoe","Milwaukee Bucks","MIL","2010s","PG",15.9,4.6,5.6,1.6,0.4],
  ["Brook Lopez","Milwaukee Bucks","MIL","2010s","C",12.5,5.5,2.2,0.6,1.8],
  ["Malcolm Brogdon","Milwaukee Bucks","MIL","2010s","PG|SG",13.5,4.4,3.2,1.0,0.2],
  ["Anthony Davis","New Orleans Pelicans","NOP","2010s","PF|C",24.8,11.2,2.2,1.4,2.4],
  ["Jrue Holiday","New Orleans Pelicans","NOP","2010s","PG|SG",18.4,4.8,6.8,1.6,0.4],
  ["DeMarcus Cousins","New Orleans Pelicans","NOP","2010s","C|PF",25.2,12.9,5.4,1.5,1.6],
  ["E'Twaun Moore","New Orleans Pelicans","NOP","2010s","SG|SF",13.4,3.1,2.5,0.9,0.3],
  ["Kawhi Leonard","San Antonio Spurs","SAS","2010s","SF|PF",22.4,6.5,2.4,2.0,0.8],
  ["LaMarcus Aldridge","San Antonio Spurs","SAS","2010s","PF|C",20.8,7.8,2.0,0.6,1.3],
  ["Tony Parker","San Antonio Spurs","SAS","2010s","PG",17.6,2.8,6.2,0.6,0.1],
  ["Tim Duncan","San Antonio Spurs","SAS","2010s","PF|C",13.2,8.8,2.6,0.6,1.8],
  ["Manu Ginobili","San Antonio Spurs","SAS","2010s","SG|PG",16.5,3.8,3.8,1.4,0.3],
  ["LeBron James","Cleveland Cavaliers","CLE","2010s","PG|SG|SF|PF",24.8,7.8,8.2,1.3,0.6],
  ["Kyrie Irving","Cleveland Cavaliers","CLE","2010s","PG|SG",22.4,3.4,5.8,1.3,0.3],
  ["Kevin Love","Cleveland Cavaliers","CLE","2010s","PF|C",17.2,10.2,2.2,0.6,0.7],
  ["J.R. Smith","Cleveland Cavaliers","CLE","2010s","SG|SF",12.7,3.3,2.2,0.9,0.2],
  ["Tristan Thompson","Cleveland Cavaliers","CLE","2010s","C|PF",8.5,10.6,0.8,0.5,0.8],
  ["Luka Dončić","Dallas Mavericks","DAL","2010s","PG|SG|SF",21.2,7.8,6.0,1.4,0.3],
  ["Dirk Nowitzki","Dallas Mavericks","DAL","2010s","PF|C",19.4,7.2,2.4,0.6,0.8],
  ["Kristaps Porziņģis","Dallas Mavericks","DAL","2010s","C|PF",20.4,9.5,1.7,0.8,2.1],
  ["Wesley Matthews","Dallas Mavericks","DAL","2010s","SG|SF",13.2,3.3,1.9,1.0,0.3],
  ["Damian Lillard","Portland Trail Blazers","POR","2010s","PG",26.8,3.8,7.2,1.0,0.3],
  ["CJ McCollum","Portland Trail Blazers","POR","2010s","SG|PG",19.4,3.4,3.6,0.8,0.3],
  ["LaMarcus Aldridge","Portland Trail Blazers","POR","2010s","PF|C",21.8,9.4,2.0,0.6,1.7],
  ["Jusuf Nurkić","Portland Trail Blazers","POR","2010s","C",15.6,10.4,2.7,0.7,1.5],
  ["Al-Farouq Aminu","Portland Trail Blazers","POR","2010s","SF|PF",10.4,7.0,1.8,1.0,0.5],
  ["Nikola Jokić","Denver Nuggets","DEN","2020s","C|PF",26.4,12.4,8.2,1.3,0.9],
  ["Jamal Murray","Denver Nuggets","DEN","2020s","PG|SG",19.8,3.8,5.8,1.0,0.3],
  ["Michael Porter Jr.","Denver Nuggets","DEN","2020s","SF|PF",20.6,7.3,1.7,0.7,0.8],
  ["Aaron Gordon","Denver Nuggets","DEN","2020s","PF|SF",13.9,7.2,3.5,0.9,1.0],
  ["KCP","Denver Nuggets","DEN","2020s","SG|SF",13.1,3.6,2.4,1.3,0.3],
  ["Giannis Antetokounmpo","Milwaukee Bucks","MIL","2020s","PF|SF|C",28.8,11.4,5.4,0.8,1.0],
  ["Khris Middleton","Milwaukee Bucks","MIL","2020s","SF|PF",18.8,5.2,4.8,1.0,0.4],
  ["Jrue Holiday","Milwaukee Bucks","MIL","2020s","PG|SG",15.8,4.2,6.0,1.5,0.5],
  ["Brook Lopez","Milwaukee Bucks","MIL","2020s","C",14.5,5.1,1.9,0.7,2.6],
  ["Bobby Portis","Milwaukee Bucks","MIL","2020s","PF|C",14.6,9.1,1.4,0.5,0.4],
  ["Luka Dončić","Dallas Mavericks","DAL","2020s","PG|SG|SF",32.4,8.8,9.4,1.4,0.5],
  ["Kyrie Irving","Dallas Mavericks","DAL","2020s","PG|SG",23.8,4.6,4.8,1.2,0.4],
  ["Daniel Gafford","Dallas Mavericks","DAL","2020s","C",11.8,7.4,1.0,0.6,2.4],
  ["Derrick Jones Jr.","Dallas Mavericks","DAL","2020s","SF|PF",9.5,4.2,1.2,1.2,1.2],
  ["Tim Hardaway Jr.","Dallas Mavericks","DAL","2020s","SG|SF",14.8,3.3,2.0,0.6,0.4],
  ["Joel Embiid","Philadelphia 76ers","PHI","2020s","C|PF",30.6,9.8,4.0,1.0,1.6],
  ["Tyrese Maxey","Philadelphia 76ers","PHI","2020s","PG|SG",22.4,3.4,5.6,0.9,0.4],
  ["Tobias Harris","Philadelphia 76ers","PHI","2020s","SF|PF",17.2,6.7,3.3,0.8,0.5],
  ["James Harden","Philadelphia 76ers","PHI","2020s","SG|PG",21.0,6.1,10.7,1.2,0.6],
  ["Georges Niang","Philadelphia 76ers","PHI","2020s","PF|SF",11.5,4.1,2.0,0.6,0.3],
  ["Jayson Tatum","Boston Celtics","BOS","2020s","SF|PF",27.2,8.2,4.6,1.1,1.0],
  ["Jaylen Brown","Boston Celtics","BOS","2020s","SG|SF",24.2,5.4,3.2,1.1,0.4],
  ["Kristaps Porziņģis","Boston Celtics","BOS","2020s","C|PF",20.1,7.2,1.7,0.7,2.0],
  ["Jrue Holiday","Boston Celtics","BOS","2020s","PG|SG",12.5,5.4,4.8,1.6,0.5],
  ["Al Horford","Boston Celtics","BOS","2020s","C|PF",11.9,7.0,3.4,0.8,1.2],
  ["Shai Gilgeous-Alexander","Oklahoma City Thunder","OKC","2020s","PG|SG",30.2,5.2,5.8,1.9,1.0],
  ["Jalen Williams","Oklahoma City Thunder","OKC","2020s","SG|SF",21.4,4.2,5.0,1.2,0.5],
  ["Chet Holmgren","Oklahoma City Thunder","OKC","2020s","C|PF",15.2,7.4,1.8,0.8,2.1],
  ["Isaiah Hartenstein","Oklahoma City Thunder","OKC","2020s","C|PF",10.4,9.2,3.3,0.9,1.4],
  ["Lu Dort","Oklahoma City Thunder","OKC","2020s","SG|SF",13.9,3.9,2.2,1.4,0.5],
  ["Anthony Edwards","Minnesota Timberwolves","MIN","2020s","SG|SF",24.8,5.2,4.8,1.2,0.5],
  ["Karl-Anthony Towns","Minnesota Timberwolves","MIN","2020s","C|PF",21.9,8.5,3.0,0.7,1.2],
  ["Rudy Gobert","Minnesota Timberwolves","MIN","2020s","C",14.0,12.9,1.5,0.7,2.1],
  ["Mike Conley","Minnesota Timberwolves","MIN","2020s","PG",11.3,3.1,5.5,1.3,0.2],
  ["Jaden McDaniels","Minnesota Timberwolves","MIN","2020s","SF|PF",13.6,4.8,2.0,1.2,1.1],
  ["Domantas Sabonis","Sacramento Kings","SAC","2020s","C|PF",18.8,11.4,6.6,1.1,0.8],
  ["De'Aaron Fox","Sacramento Kings","SAC","2020s","PG|SG",24.2,4.1,6.6,1.5,0.4],
  ["Kevin Huerter","Sacramento Kings","SAC","2020s","SG|SF",14.9,4.2,3.5,0.9,0.3],
  ["Keegan Murray","Sacramento Kings","SAC","2020s","SF|PF",15.3,5.7,1.7,0.9,1.0],
  ["Harrison Barnes","Sacramento Kings","SAC","2020s","SF|PF",14.5,5.5,2.3,0.7,0.4],
  ["Tyrese Haliburton","Indiana Pacers","IND","2020s","PG",19.4,3.5,9.8,1.4,0.4],
  ["Pascal Siakam","Indiana Pacers","IND","2020s","PF|SF",20.8,7.2,3.4,0.9,0.8],
  ["Myles Turner","Indiana Pacers","IND","2020s","C|PF",14.9,6.4,1.5,0.8,2.6],
  ["Bennedict Mathurin","Indiana Pacers","IND","2020s","SG|SF",17.0,4.1,2.3,0.8,0.3],
  ["Andrew Nembhard","Indiana Pacers","IND","2020s","PG|SG",11.4,3.8,5.1,1.3,0.4],
  ["Victor Wembanyama","San Antonio Spurs","SAS","2020s","C|PF",25.0,11.5,3.1,1.3,3.1],
  ["Dylan Harper","San Antonio Spurs","SAS","2020s","PG|SG",14.8,4.2,3.9,1.0,0.3],
  ["Luke Kornet","San Antonio Spurs","SAS","2020s","C",6.2,6.1,1.4,0.4,1.0],
  ["Carter Bryant","San Antonio Spurs","SAS","2020s","SF|PF",5.8,3.4,1.4,0.6,0.4],
  ["Kelly Olynyk","San Antonio Spurs","SAS","2020s","PF|C",8.4,5.4,2.8,0.6,0.6],
  ["Stephon Castle","San Antonio Spurs","SAS","2020s","PG|SG",16.7,5.3,7.4,1.1,0.3],
  ["De'Aaron Fox","San Antonio Spurs","SAS","2020s","PG|SG",18.6,3.8,6.2,1.2,0.3],
  ["Harrison Barnes","San Antonio Spurs","SAS","2020s","SF|PF",11.8,5.2,2.0,0.8,0.4],
  ["Devin Vassell","San Antonio Spurs","SAS","2020s","SG|SF",13.9,4.2,2.8,1.1,0.3],
  ["Keldon Johnson","San Antonio Spurs","SAS","2020s","SF|SG",9.8,5.4,1.8,0.8,0.4],
  ["Jeremy Sochan","San Antonio Spurs","SAS","2020s","PF|SF",11.4,6.5,2.4,0.8,0.4],
  ["LeBron James","Los Angeles Lakers","LAL","2020s","PG|SG|SF|PF",26.8,7.8,7.8,1.2,0.5],
  ["Anthony Davis","Los Angeles Lakers","LAL","2020s","PF|C",22.8,11.8,3.2,1.1,2.1],
  ["Austin Reaves","Los Angeles Lakers","LAL","2020s","SG|PG",15.9,4.3,5.5,1.2,0.4],
  ["D'Angelo Russell","Los Angeles Lakers","LAL","2020s","PG|SG",18.0,3.1,6.3,0.8,0.3],
  ["Rui Hachimura","Los Angeles Lakers","LAL","2020s","SF|PF",13.9,4.5,1.5,0.6,0.5],
  ["Stephen Curry","Golden State Warriors","GSW","2020s","PG|SG",28.8,5.0,5.8,1.2,0.4],
  ["Klay Thompson","Golden State Warriors","GSW","2020s","SG|SF",19.4,3.6,2.2,0.8,0.4],
  ["Draymond Green","Golden State Warriors","GSW","2020s","PF|C|SF",8.5,7.3,6.8,1.3,1.1],
  ["Andrew Wiggins","Golden State Warriors","GSW","2020s","SF|SG",17.1,4.5,2.4,0.9,0.9],
  ["Jordan Poole","Golden State Warriors","GSW","2020s","SG|PG",20.4,3.4,4.5,1.0,0.3],
  ["Tom Meschery","Golden State Warriors","GSW","1960s","PF|C",13.0,9.6,1.7,1.0,1.0],
  ["Rudy LaRusso","Golden State Warriors","GSW","1960s","PF|SF",14.7,10.5,2.3,1.0,1.0],
  ["Jim King","Golden State Warriors","GSW","1960s","PG|SG",10.3,2.9,4.1,1.2,0.1],
  ["Don Nelson","Boston Celtics","BOS","1960s","SF|PF",15.4,7.4,1.8,1.2,0.6],
  ["Larry Siegfried","Boston Celtics","BOS","1960s","SG|PG",13.3,3.6,3.8,1.4,0.2],
  ["Rudy LaRusso","Los Angeles Lakers","LAL","1960s","PF|SF",16.4,12.1,2.1,1.0,1.0],
  ["Mel Counts","Los Angeles Lakers","LAL","1960s","C|PF",10.9,8.3,1.4,1.0,1.8],
  ["Happy Hairston","Sacramento Kings","SAC","1960s","PF|C",11.6,9.8,1.4,1.0,1.0],
  ["Johnny Green","Sacramento Kings","SAC","1960s","C",9.2,12.1,1.3,1.0,1.8],
  ["Cazzie Russell","New York Knicks","NYK","1960s","SG|SF",17.1,4.4,2.3,1.4,0.2],
  ["Phil Jackson","New York Knicks","NYK","1960s","SF|PF",11.1,5.8,2.1,1.2,0.6],
  ["Archie Clark","Philadelphia 76ers","PHI","1960s","PG|SG",14.0,3.8,4.9,1.2,0.1],
  ["Matt Guokas","Philadelphia 76ers","PHI","1960s","PG",8.6,2.8,3.9,1.2,0.1],
  ["Happy Hairston","Detroit Pistons","DET","1960s","PF|C",14.1,11.2,1.6,1.0,1.0],
  ["Ray Scott","Detroit Pistons","DET","1960s","PF|SF",14.9,9.1,2.0,1.0,1.0],
  ["Richie Guerin","Atlanta Hawks","ATL","1960s","PG|SG",18.3,5.1,6.2,1.2,0.1],
  ["Joe Caldwell","Atlanta Hawks","ATL","1960s","SF|SG",15.4,5.3,3.4,1.2,0.6],
  ["Wes Unseld","Washington Wizards","WAS","1960s","C",13.8,18.2,2.6,1.0,1.8],
  ["Bob Ferry","Washington Wizards","WAS","1960s","PF|C",10.8,7.2,2.1,1.0,1.0],
  ["Bob Weiss","Chicago Bulls","CHI","1960s","PG",10.4,2.6,4.1,1.2,0.1],
  ["Len Chappell","Chicago Bulls","CHI","1960s","PF|C",12.0,8.6,1.1,1.0,1.0],
  ["Toby Kimball","Houston Rockets","HOU","1960s","C|PF",8.1,11.7,1.3,1.0,1.8],
  ["Dave Gambee","Houston Rockets","HOU","1960s","PF|SF",12.5,6.8,1.2,1.0,1.0],
  ["Mel Counts","Phoenix Suns","PHX","1960s","C|PF",12.4,9.3,1.8,1.0,1.8],
  ["Otto Moore","Utah Jazz","UTA","1970s","C",9.2,9.8,1.6,0.8,1.3],
  ["Jim McElroy","Utah Jazz","UTA","1970s","PG|SG",11.2,2.7,4.1,1.0,0.1],
  ["Nate Williams","Utah Jazz","UTA","1970s","SF|SG",14.4,4.9,2.3,1.2,0.3],
  ["Neal Walk","Utah Jazz","UTA","1970s","C|PF",12.8,10.2,2.1,0.6,0.8],
  ["Herm Gilliam","Atlanta Hawks","ATL","1970s","SG|SF",13.1,4.1,3.0,1.2,0.2],
  ["Walt Bellamy","Atlanta Hawks","ATL","1970s","C",12.5,12.8,1.5,0.5,0.5],
  ["Tom Van Arsdale","Atlanta Hawks","ATL","1970s","SF|SG",16.0,5.0,2.2,0.8,0.2],
  ["Mickey Davis","Milwaukee Bucks","MIL","1970s","SF|PF",10.5,5.8,2.0,0.9,0.3],
  ["Cornell Warner","Milwaukee Bucks","MIL","1970s","PF|C",6.1,8.0,1.0,0.7,0.8],
  ["Don Chaney","Boston Celtics","BOS","1970s","SG|SF",10.4,3.7,2.2,1.1,0.4],
  ["Don Nelson","Boston Celtics","BOS","1970s","PF|SF",14.0,6.6,2.0,0.7,0.5],
  ["Charles Johnson","Golden State Warriors","GSW","1970s","SG|SF",11.6,3.7,2.8,1.4,0.3],
  ["Jim McMillian","Los Angeles Lakers","LAL","1970s","SF|SG",18.8,5.3,2.3,0.7,0.3],
  ["Jim Price","Los Angeles Lakers","LAL","1970s","SG|PG",11.5,2.8,3.4,0.9,0.2],
  ["Phil Jackson","New York Knicks","NYK","1970s","SF|PF",11.1,5.8,2.1,0.8,0.4],
  ["Henry Bibby","New York Knicks","NYK","1970s","PG",8.9,2.7,4.3,1.2,0.1],
  ["Harvey Catchings","Philadelphia 76ers","PHI","1970s","C|PF",5.8,8.2,0.8,0.6,2.1],
  ["Fred Carter","Philadelphia 76ers","PHI","1970s","SG|SF",17.4,4.3,3.8,1.8,0.3],
  ["Robert Reid","Houston Rockets","HOU","1970s","SF|SG",13.5,5.4,2.8,1.3,0.7],
  ["Tom Henderson","Houston Rockets","HOU","1970s","PG",10.0,2.8,5.1,1.3,0.1],
  ["Larry Steele","Portland Trail Blazers","POR","1970s","SG|SF",10.7,3.3,2.4,2.7,0.3],
  ["Mike Gale","San Antonio Spurs","SAS","1970s","PG",8.6,2.9,4.8,1.7,0.1],
  ["Mark Olberding","San Antonio Spurs","SAS","1970s","PF|C",9.4,6.0,2.1,0.8,0.5],
  ["Brian Taylor","Denver Nuggets","DEN","1970s","PG|SG",12.4,3.2,5.1,2.4,0.2],
  ["Claude Terry","Denver Nuggets","DEN","1970s","SG|SF",10.8,3.1,2.6,1.1,0.2],
  ["Dennis Awtrey","Phoenix Suns","PHX","1970s","C",6.4,7.6,2.3,0.6,0.5],
  ["Mike Riordan","Washington Wizards","WAS","1970s","SG|SF",13.8,3.4,2.8,1.1,0.2],
  ["Leonard Robinson","Washington Wizards","WAS","1970s","PF|C",10.8,8.7,1.3,0.7,0.6],
  ["M.L. Carr","Detroit Pistons","DET","1970s","SF|SG",10.4,4.2,2.4,1.6,0.4],
  ["John Mengelt","Detroit Pistons","DET","1970s","SG|PG",14.4,2.5,2.9,0.8,0.1],
  ["Gar Heard","Los Angeles Clippers","LAC","1970s","PF|C",11.2,10.0,1.9,0.9,0.9],
  ["Jack Marin","Los Angeles Clippers","LAC","1970s","SF|SG",14.6,4.3,2.0,0.7,0.2],
  ["Billy Knight","Indiana Pacers","IND","1970s","SF|SG",19.9,5.0,2.2,1.0,0.3],
  ["Darnell Hillman","Indiana Pacers","IND","1970s","PF|C",12.0,8.4,1.8,1.0,1.3],
  ["Dave Corzine","Chicago Bulls","CHI","1980s","C",10.4,6.2,1.4,0.5,1.0],
  ["Charles Oakley","Chicago Bulls","CHI","1980s","PF|C",12.0,13.1,2.6,0.9,0.4],
  ["Norm Nixon","Los Angeles Lakers","LAL","1980s","PG",17.1,3.6,9.0,1.4,0.1],
  ["Bob McAdoo","Los Angeles Lakers","LAL","1980s","C|PF",12.3,5.7,1.5,0.5,1.8],
  ["Cedric Maxwell","Boston Celtics","BOS","1980s","SF|PF",12.8,6.4,3.1,0.9,0.5],
  ["Gerald Henderson","Boston Celtics","BOS","1980s","SG|PG",10.7,2.7,3.3,1.2,0.2],
  ["John Salley","Detroit Pistons","DET","1980s","PF|C",8.2,5.4,1.4,0.8,1.8],
  ["James Edwards","Detroit Pistons","DET","1980s","C",12.5,5.2,0.9,0.3,1.3],
  ["Bobby Jones","Philadelphia 76ers","PHI","1980s","SF|PF",9.4,5.0,2.0,1.3,1.1],
  ["Marc Iavaroni","Philadelphia 76ers","PHI","1980s","PF|SF",6.8,4.9,1.5,0.7,0.5],
  ["Allen Leavell","Houston Rockets","HOU","1980s","PG",10.0,2.3,5.1,1.0,0.1],
  ["Robert Reid","Houston Rockets","HOU","1980s","SF|SG",13.5,5.4,2.8,1.3,0.7],
  ["Adrian Dantley","Utah Jazz","UTA","1980s","SF|SG",30.7,7.2,3.3,1.2,0.3],
  ["Rich Kelley","Utah Jazz","UTA","1980s","C",7.8,8.8,2.9,0.7,0.8],
  ["Mychal Thompson","Portland Trail Blazers","POR","1980s","C|PF",14.2,8.3,2.2,0.7,1.0],
  ["Calvin Natt","Portland Trail Blazers","POR","1980s","SF|PF",17.4,6.3,2.4,0.8,0.5],
  ["Antoine Carr","Atlanta Hawks","ATL","1980s","PF|C",12.6,5.4,1.1,0.6,1.4],
  ["Glenn Rivers","Atlanta Hawks","ATL","1980s","PG",12.8,4.1,6.2,1.8,0.2],
  ["Johnny Moore","San Antonio Spurs","SAS","1980s","PG",11.8,3.3,9.8,2.6,0.1],
  ["Mike Mitchell","San Antonio Spurs","SAS","1980s","SF|SG",23.3,5.1,1.7,0.8,0.4],
  ["Trent Tucker","New York Knicks","NYK","1980s","SG|SF",10.8,2.6,2.0,1.1,0.3],
  ["Bill Cartwright","New York Knicks","NYK","1980s","C",14.8,7.6,1.6,0.5,1.0],
  ["B.J. Armstrong","Chicago Bulls","CHI","1990s","PG",12.6,2.3,4.3,0.9,0.1],
  ["Steve Kerr","Chicago Bulls","CHI","1990s","PG|SG",8.1,1.5,2.9,0.8,0.1],
  ["Kendall Gill","Oklahoma City Thunder","OKC","1990s","SG|SF",16.4,4.3,3.7,1.9,0.4],
  ["Ervin Johnson","Oklahoma City Thunder","OKC","1990s","C",5.0,7.5,0.6,0.4,1.6],
  ["Sam Cassell","Houston Rockets","HOU","1990s","PG",16.5,3.0,6.4,1.1,0.2],
  ["Carl Herrera","Houston Rockets","HOU","1990s","PF|SF",7.6,5.9,1.2,0.8,0.8],
  ["Antoine Carr","Utah Jazz","UTA","1990s","PF|C",9.4,4.7,1.0,0.5,0.9],
  ["Howard Eisley","Utah Jazz","UTA","1990s","PG",7.9,2.4,4.6,0.8,0.1],
  ["Danny Ainge","Phoenix Suns","PHX","1990s","PG|SG",9.5,2.3,4.4,1.0,0.1],
  ["Tim Perry","Phoenix Suns","PHX","1990s","PF|SF",7.2,5.7,0.9,0.7,1.0],
  ["Derek Harper","New York Knicks","NYK","1990s","PG|SG",12.5,2.7,5.1,1.5,0.2],
  ["Anthony Mason","New York Knicks","NYK","1990s","PF|SF",13.1,9.1,3.9,1.0,0.4],
  ["Jaren Jackson Sr.","San Antonio Spurs","SAS","1990s","SG|SF",11.8,2.7,2.1,0.9,0.3],
  ["Chuck Person","San Antonio Spurs","SAS","1990s","SF|PF",12.4,5.4,2.0,0.8,0.3],
  ["Brian Shaw","Orlando Magic","ORL","1990s","PG|SG",8.8,4.0,5.1,0.9,0.3],
  ["Anthony Bowie","Orlando Magic","ORL","1990s","SG|SF",9.4,3.3,2.3,1.1,0.2],
  ["Antonio Davis","Indiana Pacers","IND","1990s","PF|C",8.7,7.3,0.9,0.6,1.2],
  ["Travis Best","Indiana Pacers","IND","1990s","PG",10.4,2.3,5.6,1.4,0.1],
  ["Billy Owens","Sacramento Kings","SAC","1990s","SF|PF",14.5,7.5,3.7,1.0,0.5],
  ["Brian Grant","Sacramento Kings","SAC","1990s","PF|C",12.1,8.9,1.3,0.7,1.0],
  ["Blue Edwards","Milwaukee Bucks","MIL","1990s","SG|SF",14.5,4.2,2.5,1.3,0.5],
  ["Jon Barry","Milwaukee Bucks","MIL","1990s","PG|SG",9.7,3.1,4.2,1.3,0.2],
  ["Lamar Odom","Los Angeles Lakers","LAL","2000s","PF|SF",14.6,10.0,3.5,1.1,0.6],
  ["Jordan Farmar","Los Angeles Lakers","LAL","2000s","PG",9.3,2.2,4.1,0.9,0.2],
  ["Donyell Marshall","Cleveland Cavaliers","CLE","2000s","PF|SF",8.7,6.4,1.2,0.6,0.6],
  ["Sasha Pavlovic","Cleveland Cavaliers","CLE","2000s","SF|SG",9.0,3.1,1.5,0.9,0.3],
  ["Udonis Haslem","Miami Heat","MIA","2000s","PF|C",10.2,9.4,1.2,0.5,0.4],
  ["Gary Payton","Miami Heat","MIA","2000s","PG|SG",9.2,3.2,5.1,1.5,0.2],
  ["Josh Howard","Dallas Mavericks","DAL","2000s","SF|SG",15.7,6.4,2.3,1.4,0.5],
  ["Jerry Stackhouse","Dallas Mavericks","DAL","2000s","SG|SF",13.9,3.3,2.7,0.9,0.2],
  ["Boris Diaw","Phoenix Suns","PHX","2000s","PF|SF",13.3,6.5,6.0,0.8,0.5],
  ["Kurt Thomas","Phoenix Suns","PHX","2000s","PF|C",7.9,7.9,1.2,0.7,0.8],
  ["Kyle Korver","Philadelphia 76ers","PHI","2000s","SF|SG",9.4,3.3,1.6,0.7,0.3],
  ["Kevin Ollie","Philadelphia 76ers","PHI","2000s","PG",5.1,1.9,3.2,0.8,0.1],
  ["Rasho Nesterovic","San Antonio Spurs","SAS","2000s","C",6.6,5.3,0.9,0.5,1.1],
  ["Michael Finley","San Antonio Spurs","SAS","2000s","SG|SF",11.5,3.0,2.2,0.9,0.3],
  ["Antonio McDyess","Detroit Pistons","DET","2000s","PF|C",9.1,7.5,0.9,0.6,1.1],
  ["Lindsey Hunter","Detroit Pistons","DET","2000s","PG|SG",7.7,2.4,2.9,1.2,0.2],
  ["Troy Hudson","Minnesota Timberwolves","MIN","2000s","PG",10.4,2.0,4.6,0.8,0.1],
  ["Michael Olowokandi","Minnesota Timberwolves","MIN","2000s","C",8.5,7.6,1.0,0.5,1.1],
  ["Dwight Howard","Orlando Magic","ORL","2000s","C",20.6,13.8,1.3,0.9,2.9],
  ["Hedo Turkoglu","Orlando Magic","ORL","2000s","SF|PF",16.2,5.7,5.0,1.0,0.4],
  ["Kenyon Martin","Denver Nuggets","DEN","2000s","PF|C",10.9,7.8,1.6,0.9,0.8],
  ["Nene","Denver Nuggets","DEN","2000s","C|PF",14.5,8.8,1.8,0.7,1.3],
  ["Leon Powe","Boston Celtics","BOS","2000s","PF|C",10.3,5.3,0.4,0.4,0.7],
  ["James Posey","Boston Celtics","BOS","2000s","SF|PF",7.3,4.0,1.7,1.2,0.4],
  ["Udonis Haslem","Miami Heat","MIA","2010s","PF|C",7.8,7.0,1.1,0.5,0.4],
  ["Shane Battier","Miami Heat","MIA","2010s","SF|PF",6.1,3.8,1.7,1.1,0.5],
  ["Nick Collison","Oklahoma City Thunder","OKC","2010s","PF|C",5.5,5.7,1.6,0.7,0.5],
  ["Thabo Sefolosha","Oklahoma City Thunder","OKC","2010s","SF|SG",7.4,4.0,1.8,1.4,0.4],
  ["David Lee","Golden State Warriors","GSW","2010s","PF|C",18.5,9.7,3.4,0.8,0.5],
  ["Harrison Barnes","Golden State Warriors","GSW","2010s","SF|PF",10.6,4.8,1.3,0.7,0.3],
  ["Trevor Ariza","Houston Rockets","HOU","2010s","SF|PF",12.9,5.2,2.2,1.9,0.4],
  ["Dwight Howard","Houston Rockets","HOU","2010s","C",17.9,12.3,1.8,0.8,1.9],
  ["Jabari Parker","Milwaukee Bucks","MIL","2010s","PF|SF",20.1,6.0,2.8,0.8,0.5],
  ["Greg Monroe","Milwaukee Bucks","MIL","2010s","C|PF",14.3,9.3,3.8,0.8,0.5],
  ["Ryan Anderson","New Orleans Pelicans","NOP","2010s","PF|SF",13.4,5.7,1.1,0.4,0.4],
  ["Tyreke Evans","New Orleans Pelicans","NOP","2010s","SG|SF",17.8,5.2,5.1,1.3,0.4],
  ["Pau Gasol","San Antonio Spurs","SAS","2010s","PF|C",12.7,7.8,3.2,0.7,1.6],
  ["Danny Green","San Antonio Spurs","SAS","2010s","SG|SF",10.1,3.6,1.7,1.4,0.5],
  ["Deron Williams","Cleveland Cavaliers","CLE","2010s","PG",12.6,3.0,6.2,0.8,0.2],
  ["Iman Shumpert","Cleveland Cavaliers","CLE","2010s","SG|SF",7.5,3.5,1.8,1.3,0.3],
  ["Harrison Barnes","Dallas Mavericks","DAL","2010s","SF|PF",17.3,5.4,1.7,0.8,0.4],
  ["Deron Williams","Dallas Mavericks","DAL","2010s","PG",16.6,3.2,7.5,1.1,0.3],
  ["Moe Harkless","Portland Trail Blazers","POR","2010s","SF|PF",10.0,4.4,1.6,1.1,0.5],
  ["Evan Turner","Portland Trail Blazers","POR","2010s","SG|SF",10.5,5.1,4.0,0.9,0.3],
  ["Damian Lillard","Milwaukee Bucks","MIL","2020s","PG",24.3,4.4,7.1,0.9,0.4],
  ["Pat Connaughton","Milwaukee Bucks","MIL","2020s","SG|SF",9.3,5.2,2.0,0.7,0.3],
  ["P.J. Washington","Dallas Mavericks","DAL","2020s","PF|SF",12.6,4.8,2.3,0.9,0.7],
  ["Quentin Grimes","Dallas Mavericks","DAL","2020s","SG|SF",10.8,3.4,1.8,1.0,0.3],
  ["Kelly Oubre Jr.","Philadelphia 76ers","PHI","2020s","SF|SG",15.4,5.0,1.5,1.1,0.4],
  ["De'Anthony Melton","Philadelphia 76ers","PHI","2020s","SG|PG",10.2,3.8,3.0,1.8,0.4],
  ["Marcus Smart","Boston Celtics","BOS","2020s","PG|SG",12.1,3.5,5.5,1.7,0.4],
  ["Grant Williams","Boston Celtics","BOS","2020s","SF|PF",8.0,4.1,1.7,0.7,0.5],
  ["Josh Giddey","Oklahoma City Thunder","OKC","2020s","PG|SF",16.6,7.9,6.4,0.8,0.4],
  ["Luguentz Dort","Oklahoma City Thunder","OKC","2020s","SG|SF",13.9,3.9,2.2,1.4,0.5],
  ["Naz Reid","Minnesota Timberwolves","MIN","2020s","C|PF",13.5,5.8,1.9,0.6,1.0],
  ["Nickeil Alexander-Walker","Minnesota Timberwolves","MIN","2020s","SG|SF",11.1,3.1,2.7,1.0,0.4],
  ["Davion Mitchell","Sacramento Kings","SAC","2020s","PG",11.7,2.4,4.5,1.4,0.2],
  ["Alex Len","Sacramento Kings","SAC","2020s","C",9.2,7.4,1.2,0.5,1.2],
  ["T.J. McConnell","Indiana Pacers","IND","2020s","PG",9.7,3.6,7.3,1.7,0.3],
  ["Obi Toppin","Indiana Pacers","IND","2020s","PF|SF",14.5,5.6,1.8,0.7,0.4],
  ["Taurean Prince","Los Angeles Lakers","LAL","2020s","SF|PF",10.4,3.9,1.4,0.8,0.3],
  ["Gabe Vincent","Los Angeles Lakers","LAL","2020s","PG|SG",8.9,2.2,3.0,0.9,0.2],
  ["Gary Payton II","Golden State Warriors","GSW","2020s","SG|PG",7.1,3.5,1.8,1.7,0.6],
  ["Kevon Looney","Golden State Warriors","GSW","2020s","C|PF",6.0,7.3,2.4,0.5,0.4],
  ["Reggie Jackson","Denver Nuggets","DEN","2020s","PG|SG",12.0,2.6,4.3,0.7,0.2],
  ["Zeke Nnaji","Denver Nuggets","DEN","2020s","PF|C",7.2,5.0,0.7,0.4,0.6],
  ["Frank Ramsey","Boston Celtics","BOS","1960s","SF|SG",14.0,5.8,2.4,1.2,0.6],
  ["Jim Loscutoff","Boston Celtics","BOS","1960s","PF|SF",8.8,6.8,1.0,1.2,1.0],
  ["Willie Naulls","Boston Celtics","BOS","1960s","PF|SF",12.4,7.6,1.6,1.2,1.0],
  ["Satch Sanders","Boston Celtics","BOS","1960s","SF|PF",9.0,6.4,1.4,1.2,0.6],
  ["Dick Barnett","Los Angeles Lakers","LAL","1960s","SG|PG",17.8,2.8,2.6,1.4,0.2],
  ["Jim Krebs","Los Angeles Lakers","LAL","1960s","C|PF",9.8,9.2,1.2,1.0,1.8],
  ["Tom Hawkins","Los Angeles Lakers","LAL","1960s","SF|PF",11.0,7.4,1.4,1.2,0.6],
  ["Leroy Ellis","Los Angeles Lakers","LAL","1960s","C|PF",9.5,9.0,1.0,1.0,1.8],
  ["Ted Luckenbill","Golden State Warriors","GSW","1960s","PF|C",7.2,7.8,0.8,1.0,1.8],
  ["Gary Phillips","Golden State Warriors","GSW","1960s","SG|PG",9.5,2.8,2.8,1.4,0.2],
  ["Bob Boozer","Sacramento Kings","SAC","1960s","PF|C",18.0,9.8,1.5,1.0,1.8],
  ["Arlen Bockhorn","Sacramento Kings","SAC","1960s","SG|SF",13.2,4.2,3.2,1.4,0.2],
  ["Wayne Embry","Sacramento Kings","SAC","1960s","C",11.8,9.6,1.4,1.0,1.8],
  ["Howard Komives","New York Knicks","NYK","1960s","PG|SG",14.4,2.8,4.2,1.2,0.1],
  ["Emmette Bryant","New York Knicks","NYK","1960s","PG",9.2,2.6,3.8,1.2,0.1],
    ["Larry Costello","Philadelphia 76ers","PHI","1960s","PG",11.8,3.2,5.6,1.2,0.1],
  ["Dave Gambee","Philadelphia 76ers","PHI","1960s","PF|SF",14.0,7.8,1.4,1.0,1.0],
  ["Johnny Kerr","Philadelphia 76ers","PHI","1960s","C|PF",8.8,8.6,1.8,1.0,1.8],
  ["Bob Ferry","Detroit Pistons","DET","1960s","PF|C",11.2,8.8,2.0,1.0,1.0],
  ["Don Ohl","Detroit Pistons","DET","1960s","SG|PG",16.8,2.6,3.6,1.4,0.2],
  ["Reggie Harding","Detroit Pistons","DET","1960s","C",10.4,10.2,1.0,1.0,1.8],
  ["Mike Farmer","Atlanta Hawks","ATL","1960s","SF|PF",10.0,6.6,2.0,1.2,0.6],
  ["Rod Hundley","Atlanta Hawks","ATL","1960s","PG|SG",9.6,3.2,4.4,1.2,0.1],
  ["Don Ohl","Washington Wizards","WAS","1960s","SG|PG",18.2,2.8,3.8,1.4,0.2],
  ["Bailey Howell","Washington Wizards","WAS","1960s","PF|SF",21.0,10.8,2.2,1.0,1.0],
  ["Walt Bellamy","Washington Wizards","WAS","1960s","C",24.8,15.4,2.2,1.0,1.8],
  ["Johnny Egan","Washington Wizards","WAS","1960s","PG|SG",12.4,2.8,4.8,1.2,0.1],
  ["Flynn Robinson","Chicago Bulls","CHI","1960s","SG|PG",17.6,3.0,3.4,1.4,0.2],
  ["Erwin Mueller","Chicago Bulls","CHI","1960s","PF|C",10.4,8.8,2.2,1.0,1.0],
  ["Jim Washington","Chicago Bulls","CHI","1960s","PF|C",11.2,10.6,1.4,1.0,1.0],
  ["Henry Finkel","Houston Rockets","HOU","1960s","C",11.4,9.2,1.6,1.0,1.8],
  ["Rudy Tomjanovich","Houston Rockets","HOU","1960s","SF|PF",16.2,9.0,1.8,1.2,0.6],
  ["Rick Adelman","Houston Rockets","HOU","1960s","PG|SG",8.8,2.6,3.8,1.2,0.1],
  ["Jerry Chambers","Phoenix Suns","PHX","1960s","SF|SG",14.5,4.8,2.0,1.2,0.6],
  ["Gary Gregor","Phoenix Suns","PHX","1960s","PF|SF",10.1,7.6,1.1,1.0,1.0],
  ["Neil Johnson","Phoenix Suns","PHX","1960s","C|PF",9.8,8.2,1.2,1.0,1.8],
  ["Dave Lattin","Phoenix Suns","PHX","1960s","C",8.4,8.0,0.8,1.0,1.8],
  ["Don Kojis","Sacramento Kings","SAC","1970s","SF|SG",14.0,5.8,2.2,1.3,0.5],
  ["Larry McNeill","Sacramento Kings","SAC","1970s","PF|C",10.2,8.8,1.4,0.9,1.2],
  ["Luol Deng","Milwaukee Bucks","MIL","1970s","SF",10.1,6.4,2.1,1.0,0.4],
  ["Bobby Dandridge","Milwaukee Bucks","MIL","1970s","SF|PF",19.2,7.0,3.4,1.4,0.7],
  ["Gary Brokaw","Milwaukee Bucks","MIL","1970s","PG|SG",11.6,2.8,4.4,1.2,0.2],
  ["Elmore Smith","Milwaukee Bucks","MIL","1970s","C",10.8,9.4,1.2,0.6,3.5],
  ["Glenn McDonald","Boston Celtics","BOS","1970s","SF|SG",8.4,2.8,1.8,1.0,0.4],
  ["Sidney Wicks","Boston Celtics","BOS","1970s","PF|SF",19.0,8.4,3.4,1.2,0.8],
  ["Nate Archibald","Boston Celtics","BOS","1970s","PG",18.8,2.8,7.8,1.5,0.2],
  ["Dave Bing","Boston Celtics","BOS","1970s","PG|SG",16.4,3.2,4.6,1.0,0.2],
  ["Butch Beard","Golden State Warriors","GSW","1970s","PG|SG",11.2,3.4,5.0,1.4,0.2],
  ["George Johnson","Golden State Warriors","GSW","1970s","C|PF",8.2,8.6,1.4,0.8,3.8],
  ["Charles Dudley","Golden State Warriors","GSW","1970s","SG|PG",7.6,2.8,3.4,1.6,0.2],
  ["Derrek Dickey","Golden State Warriors","GSW","1970s","PF|SF",10.4,7.9,1.9,0.8,0.8],
  ["Elgin Baylor","Los Angeles Lakers","LAL","1970s","SF|PF",11.8,6.9,2.7,1.2,0.8],
  ["Flynn Robinson","Los Angeles Lakers","LAL","1970s","SG|PG",11.4,2.2,2.8,1.4,0.2],
  ["Dean Meminger","New York Knicks","NYK","1970s","PG|SG",9.4,3.2,3.8,1.6,0.2],
  ["John Gianelli","New York Knicks","NYK","1970s","C|PF",10.2,8.2,1.4,0.8,1.6],
  ["Mel Davis","New York Knicks","NYK","1970s","PF|SF",8.3,6.7,1.4,0.6,0.8],
  ["Butch Beard","New York Knicks","NYK","1970s","PG|SG",9.6,3.0,4.8,1.4,0.2],
  ["Jim Washington","Philadelphia 76ers","PHI","1970s","PF|C",10.6,9.4,1.6,0.8,1.0],
  ["Steve Mix","Philadelphia 76ers","PHI","1970s","SF|PF",14.4,6.8,2.4,1.2,0.6],
  ["Kevin Kunnert","Houston Rockets","HOU","1970s","C|PF",9.4,9.2,1.8,0.8,1.4],
  ["John Lucas","Houston Rockets","HOU","1970s","PG",14.6,3.4,8.2,2.0,0.2],
  ["Rick Barry","Houston Rockets","HOU","1970s","SF|SG",24.2,5.4,5.2,2.4,0.4],
  ["Sidney Wicks","Portland Trail Blazers","POR","1970s","PF|SF",21.6,9.2,3.8,1.2,0.8],
  ["Geoff Petrie","Portland Trail Blazers","POR","1970s","PG|SG",21.8,3.4,4.8,1.2,0.2],
  ["Herm Gilliam","Portland Trail Blazers","POR","1970s","SG|SF",11.4,3.8,3.4,1.4,0.3],
  ["Louie Dampier","San Antonio Spurs","SAS","1970s","PG|SG",13.4,2.8,5.8,1.2,0.2],
  ["Swen Nater","San Antonio Spurs","SAS","1970s","C",10.4,11.4,1.4,0.6,1.2],
  ["Ted McClain","Denver Nuggets","DEN","1970s","SG|PG",12.2,3.8,4.2,1.8,0.2],
  ["Byron Beck","Denver Nuggets","DEN","1970s","C|PF",12.0,9.4,2.4,0.8,1.2],
  ["Fatty Taylor","Denver Nuggets","DEN","1970s","PG",9.6,2.6,5.6,1.4,0.1],
  ["Keith Erickson","Phoenix Suns","PHX","1970s","SF|SG",12.0,4.8,3.2,1.2,0.4],
  ["Garfield Heard","Phoenix Suns","PHX","1970s","PF|SF",11.2,7.6,2.2,1.2,0.8],
  ["Neal Walk","Phoenix Suns","PHX","1970s","C|PF",13.4,10.8,2.2,0.8,1.2],
  ["Curtis Perry","Phoenix Suns","PHX","1970s","PF|C",9.8,10.2,1.8,0.9,1.0],
  ["Len Robinson","Washington Wizards","WAS","1970s","PF|C",10.8,8.7,1.3,0.7,0.6],
  ["Nick Weatherspoon","Washington Wizards","WAS","1970s","SF|PF",13.8,7.4,1.8,1.2,0.8],
  ["Tom Henderson","Washington Wizards","WAS","1970s","PG",10.4,2.8,5.6,1.4,0.2],
  ["Aaron James","Utah Jazz","UTA","1970s","SF|SG",17.8,5.4,2.1,0.9,0.3],
  ["Louie Nelson","Utah Jazz","UTA","1970s","SG|PG",10.8,2.8,3.4,1.2,0.2],
  ["E.C. Coleman","Utah Jazz","UTA","1970s","SF|PF",11.2,6.4,2.2,1.2,0.6],
  ["Connie Hawkins","Atlanta Hawks","ATL","1970s","SF|PF",16.4,7.6,3.4,1.2,0.8],
  ["Mike Sojourner","Atlanta Hawks","ATL","1970s","PF|C",7.8,7.2,1.0,0.8,1.2],
  ["Joe Caldwell","Atlanta Hawks","ATL","1970s","SF|SG",12.2,4.4,3.0,1.4,0.4],
  ["Garfield Heard","Los Angeles Clippers","LAC","1970s","PF|SF",11.2,7.6,2.2,1.2,0.8],
  ["Fred Foster","Los Angeles Clippers","LAC","1970s","SF|SG",13.6,4.8,2.2,1.2,0.4],
  ["John Shumate","Los Angeles Clippers","LAC","1970s","C|PF",14.2,8.6,1.8,1.0,1.4],
  ["Don Adams","Detroit Pistons","DET","1970s","SF|PF",11.4,7.2,2.4,1.2,0.8],
  ["Howard Porter","Detroit Pistons","DET","1970s","PF|SF",11.8,6.8,1.6,1.0,0.8],
  ["Al Eberhard","Detroit Pistons","DET","1970s","SF|PF",10.8,5.8,2.0,1.0,0.6],
  ["Len Elmore","Indiana Pacers","IND","1970s","C|PF",8.4,8.8,1.6,0.8,1.4],
  ["Freddie Lewis","Indiana Pacers","IND","1970s","PG|SG",16.0,3.2,5.4,1.4,0.2],
  ["Quintin Dailey","Chicago Bulls","CHI","1980s","SG|PG",16.8,2.6,2.4,1.0,0.2],
  ["Jawann Oldham","Chicago Bulls","CHI","1980s","C",7.2,5.8,0.8,0.6,2.4],
  ["Rod Higgins","Chicago Bulls","CHI","1980s","SF|PF",10.4,4.8,2.0,1.0,0.4],
  ["Mike Smrek","Chicago Bulls","CHI","1980s","C",5.4,4.4,0.6,0.4,1.6],
  ["Jamaal Wilkes","Los Angeles Lakers","LAL","1980s","SF|PF",16.8,6.4,2.4,1.2,0.4],
  ["Kurt Rambis","Los Angeles Lakers","LAL","1980s","PF|C",7.2,7.2,2.0,0.8,0.6],
  ["Mychal Thompson","Los Angeles Lakers","LAL","1980s","C|PF",12.0,7.8,2.2,0.6,0.8],
  ["Greg Kite","Boston Celtics","BOS","1980s","C",4.2,5.6,0.8,0.4,1.2],
  ["M.L. Carr","Boston Celtics","BOS","1980s","SF|SG",8.4,3.8,1.8,1.4,0.4],
  ["Scott Wedman","Boston Celtics","BOS","1980s","SF|SG",11.4,4.4,2.2,0.8,0.4],
  ["Rick Robey","Boston Celtics","BOS","1980s","C|PF",9.2,7.2,1.8,0.6,0.6],
  ["Kelly Tripucka","Detroit Pistons","DET","1980s","SF|SG",21.4,4.4,3.2,0.8,0.2],
  ["Rick Mahorn","Detroit Pistons","DET","1980s","PF|C",9.0,7.4,1.4,0.6,0.8],
  ["Terry Tyler","Detroit Pistons","DET","1980s","SF|PF",11.4,5.8,1.4,0.8,1.8],
  ["Sedale Threatt","Philadelphia 76ers","PHI","1980s","PG|SG",10.8,2.4,4.4,1.6,0.2],
  ["Leon Wood","Philadelphia 76ers","PHI","1980s","PG",7.4,1.8,4.8,0.8,0.1],
  ["Jim Petersen","Houston Rockets","HOU","1980s","PF|C",8.8,6.4,1.6,0.6,1.2],
  ["Purvis Short","Houston Rockets","HOU","1980s","SF|SG",18.4,4.2,2.8,1.0,0.4],
  ["Bob Hansen","Utah Jazz","UTA","1980s","SG|SF",9.6,3.2,2.6,1.2,0.4],
  ["Pace Mannion","Utah Jazz","UTA","1980s","PG|SG",8.4,2.6,4.2,0.9,0.2],
  ["Billy Paultz","Utah Jazz","UTA","1980s","C",9.4,7.2,1.8,0.6,1.4],
  ["Steve Johnson","Portland Trail Blazers","POR","1980s","C",13.2,7.0,1.4,0.6,1.6],
  ["Jim Paxson","Portland Trail Blazers","POR","1980s","SG|SF",18.4,3.4,3.4,1.2,0.4],
  ["Darnell Valentine","Portland Trail Blazers","POR","1980s","PG",9.8,3.4,6.2,1.6,0.2],
  ["Mike Glenn","Atlanta Hawks","ATL","1980s","SG|PG",12.4,2.0,2.8,0.8,0.2],
  ["Tree Rollins","Atlanta Hawks","ATL","1980s","C",7.4,7.0,1.0,0.6,3.2],
  ["Spud Webb","Atlanta Hawks","ATL","1980s","PG",11.8,2.6,6.2,1.4,0.1],
  ["Johnny Dawkins","San Antonio Spurs","SAS","1980s","PG",12.8,2.6,5.2,1.4,0.2],
  ["Frank Brickowski","San Antonio Spurs","SAS","1980s","PF|C",11.4,6.2,2.0,0.8,0.8],
  ["Darwin Cook","San Antonio Spurs","SAS","1980s","SG|PG",9.8,2.8,4.4,2.0,0.2],
  ["Rory Sparrow","New York Knicks","NYK","1980s","PG",9.8,2.8,6.2,1.0,0.2],
  ["Louis Orr","New York Knicks","NYK","1980s","SF|PF",10.4,4.2,1.6,0.8,0.6],
  ["Darrell Walker","New York Knicks","NYK","1980s","PG|SG",9.4,3.6,4.8,1.8,0.4],
  ["Bill Wennington","Chicago Bulls","CHI","1990s","C",6.8,4.4,0.8,0.4,0.8],
  ["Randy Brown","Chicago Bulls","CHI","1990s","PG|SG",5.8,2.4,2.8,1.4,0.2],
  ["Dickey Simpkins","Chicago Bulls","CHI","1990s","PF|C",5.4,4.8,0.8,0.4,0.4],
  ["Vincent Askew","Oklahoma City Thunder","OKC","1990s","SG|SF",9.2,3.3,2.6,1.1,0.3],
  ["Frank Brickowski","Oklahoma City Thunder","OKC","1990s","PF|C",9.8,5.6,1.6,0.8,0.8],
  ["Dale Ellis","Oklahoma City Thunder","OKC","1990s","SG|SF",19.4,3.8,2.2,1.0,0.3],
  ["Robert Horry","Houston Rockets","HOU","1990s","PF|SF",9.8,5.8,2.6,1.2,1.2],
  ["Matt Bullard","Houston Rockets","HOU","1990s","PF|SF",8.4,3.8,1.4,0.6,0.4],
  ["Chucky Brown","Houston Rockets","HOU","1990s","PF|SF",9.4,5.4,1.2,0.8,0.6],
  ["Thurl Bailey","Utah Jazz","UTA","1990s","SF|PF",12.8,5.4,1.4,0.6,1.0],
  ["Blue Edwards","Utah Jazz","UTA","1990s","SG|SF",10.4,3.4,2.2,1.1,0.3],
  ["Felton Spencer","Utah Jazz","UTA","1990s","C",7.2,7.8,0.8,0.4,1.4],
  ["Tom Chambers","Phoenix Suns","PHX","1990s","PF|C",18.8,7.4,2.4,0.8,0.6],
  ["A.C. Green","Phoenix Suns","PHX","1990s","PF|SF",9.6,8.4,1.2,0.8,0.4],
  ["Greg Anthony","New York Knicks","NYK","1990s","PG",7.8,2.4,5.4,1.4,0.2],
  ["Doc Rivers","New York Knicks","NYK","1990s","PG|SG",9.4,3.4,6.2,1.6,0.2],
  ["Xavier McDaniel","New York Knicks","NYK","1990s","SF|PF",16.8,6.6,2.0,1.0,0.6],
  ["Will Perdue","San Antonio Spurs","SAS","1990s","C",5.2,5.8,0.8,0.4,0.6],
  ["Tree Rollins","Orlando Magic","ORL","1990s","C",5.2,5.8,1.0,0.4,2.2],
  ["Jeff Turner","Orlando Magic","ORL","1990s","PF|SF",8.6,4.4,1.8,0.6,0.4],
  ["Donald Royal","Orlando Magic","ORL","1990s","SF|PF",8.4,4.0,1.6,0.8,0.4],
  ["Detlef Schrempf","Indiana Pacers","IND","1990s","PF|SF",18.8,8.8,4.0,0.9,0.4],
  ["Vern Fleming","Indiana Pacers","IND","1990s","PG|SG",13.2,4.4,6.2,1.0,0.2],
  ["LaSalle Thompson","Indiana Pacers","IND","1990s","C",8.8,8.2,1.4,0.6,1.4],
  ["Randy Brown","Sacramento Kings","SAC","1990s","PG|SG",8.8,3.2,3.8,1.8,0.2],
  ["Mike Peplowski","Sacramento Kings","SAC","1990s","C",6.4,5.8,1.2,0.4,0.8],
  ["Walt Williams","Sacramento Kings","SAC","1990s","SF|SG",14.4,4.4,3.2,1.2,0.6],
  ["Sherman Douglas","Milwaukee Bucks","MIL","1990s","PG",13.4,3.2,8.0,1.2,0.2],
  ["Alton Lister","Milwaukee Bucks","MIL","1990s","C",6.2,6.8,1.0,0.6,1.8],
  ["Dale Ellis","Milwaukee Bucks","MIL","1990s","SG|SF",14.8,3.4,2.0,0.9,0.3],
  ["Devean George","Los Angeles Lakers","LAL","2000s","SF|SG",8.6,3.8,1.4,0.8,0.6],
  ["Luke Walton","Los Angeles Lakers","LAL","2000s","SF|PF",6.2,4.0,3.8,0.6,0.4],
  ["Vladimir Radmanovic","Los Angeles Lakers","LAL","2000s","PF|SF",8.8,4.2,1.6,0.6,0.4],
  ["Anderson Varejao","Cleveland Cavaliers","CLE","2000s","C|PF",7.4,8.4,1.4,0.8,1.0],
  ["Ben Wallace","Cleveland Cavaliers","CLE","2000s","C|PF",6.2,8.8,1.2,1.0,1.4],
  ["Damon Jones","Miami Heat","MIA","2000s","PG|SG",9.4,1.8,4.4,0.8,0.1],
  ["James Posey","Miami Heat","MIA","2000s","SF|PF",8.8,4.2,1.8,1.4,0.4],
  ["Adrian Griffin","Dallas Mavericks","DAL","2000s","SG|SF",7.4,3.8,2.4,1.2,0.4],
  ["Erick Dampier","Dallas Mavericks","DAL","2000s","C",9.2,9.8,1.2,0.6,1.2],
  ["DeSagana Diop","Dallas Mavericks","DAL","2000s","C",4.8,6.4,0.6,0.6,1.8],
  ["Tim Thomas","Phoenix Suns","PHX","2000s","PF|SF",11.8,4.6,1.8,0.6,0.6],
  ["James Jones","Phoenix Suns","PHX","2000s","SF|SG",7.4,2.8,1.4,0.6,0.4],
  ["Kenny Thomas","Philadelphia 76ers","PHI","2000s","PF|C",11.2,8.4,1.6,0.8,0.6],
  ["Samuel Dalembert","Philadelphia 76ers","PHI","2000s","C",8.4,9.2,0.8,0.8,2.4],
  ["Stephen Jackson","San Antonio Spurs","SAS","2000s","SG|SF",9.8,3.4,2.6,1.2,0.4],
  ["Speedy Claxton","San Antonio Spurs","SAS","2000s","PG",8.4,2.2,4.8,1.4,0.2],
  ["Devin Brown","San Antonio Spurs","SAS","2000s","SG|SF",7.8,2.8,1.8,0.8,0.4],
  ["Corliss Williamson","Detroit Pistons","DET","2000s","SF|SG",10.4,4.0,1.6,0.8,0.4],
  ["Dale Davis","Detroit Pistons","DET","2000s","PF|C",7.2,7.8,0.8,0.6,1.2],
  ["Mike James","Detroit Pistons","DET","2000s","PG",11.4,2.8,5.2,1.2,0.2],
  ["Trenton Hassell","Minnesota Timberwolves","MIN","2000s","SG|SF",7.4,3.6,2.4,1.4,0.4],
  ["Mark Madsen","Minnesota Timberwolves","MIN","2000s","PF|C",4.4,5.0,1.0,0.6,0.6],
  ["Jameer Nelson","Orlando Magic","ORL","2000s","PG",13.4,3.4,5.8,1.0,0.2],
  ["Rashard Lewis","Orlando Magic","ORL","2000s","PF|SF",17.6,6.0,2.2,0.8,0.8],
  ["Linas Kleiza","Denver Nuggets","DEN","2000s","PF|SF",10.4,4.8,1.8,0.6,0.4],
  ["Eduardo Najera","Denver Nuggets","DEN","2000s","SF|PF",6.8,5.2,1.6,0.8,0.6],
  ["Earl Boykins","Denver Nuggets","DEN","2000s","PG",13.8,2.2,4.6,0.8,0.1],
  ["Tony Allen","Boston Celtics","BOS","2000s","SG|SF",8.6,2.8,1.6,1.4,0.4],
  ["Eddie House","Boston Celtics","BOS","2000s","PG|SG",9.8,2.0,2.4,0.6,0.1],
  ["Glen Davis","Boston Celtics","BOS","2000s","PF|C",8.0,5.8,1.2,0.6,0.8],
  ["Norris Cole","Miami Heat","MIA","2010s","PG|SG",5.8,2.8,2.4,1.2,0.2],
  ["Mike Miller","Miami Heat","MIA","2010s","SF|SG",7.4,4.2,1.8,0.6,0.2],
  ["Kevin Martin","Oklahoma City Thunder","OKC","2010s","SG|SF",16.4,2.8,2.2,0.8,0.2],
  ["Derek Fisher","Oklahoma City Thunder","OKC","2010s","PG",9.4,2.2,3.8,0.8,0.1],
  ["Kendrick Perkins","Oklahoma City Thunder","OKC","2010s","C",5.2,6.4,1.4,0.4,1.0],
  ["Leandro Barbosa","Golden State Warriors","GSW","2010s","PG|SG",10.2,2.0,2.2,0.6,0.2],
  ["Marreese Speights","Golden State Warriors","GSW","2010s","C|PF",9.4,4.6,0.8,0.4,0.8],
  ["Zaza Pachulia","Golden State Warriors","GSW","2010s","C",6.6,5.8,1.4,0.6,0.4],
  ["Nene","Houston Rockets","HOU","2010s","C|PF",10.8,6.2,1.8,0.6,0.8],
  ["P.J. Tucker","Houston Rockets","HOU","2010s","PF|SF",7.8,6.4,1.6,1.2,0.4],
  ["Gerald Green","Houston Rockets","HOU","2010s","SG|SF",11.8,3.2,1.4,0.6,0.4],
  ["Tony Snell","Milwaukee Bucks","MIL","2010s","SG|SF",8.2,2.8,1.6,0.8,0.4],
  ["John Henson","Milwaukee Bucks","MIL","2010s","C|PF",8.4,7.2,1.4,0.6,2.0],
  ["O.J. Mayo","Milwaukee Bucks","MIL","2010s","SG|PG",13.2,3.2,2.4,0.8,0.2],
  ["Alexis Ajinca","New Orleans Pelicans","NOP","2010s","C",8.4,5.8,0.8,0.6,1.2],
  ["Norris Cole","New Orleans Pelicans","NOP","2010s","PG",6.4,2.8,3.4,1.2,0.2],
  ["Quincy Pondexter","New Orleans Pelicans","NOP","2010s","SF|SG",9.0,3.4,1.8,0.8,0.4],
  ["Boris Diaw","San Antonio Spurs","SAS","2010s","PF|SF",9.2,4.8,3.8,0.6,0.4],
  ["Patty Mills","San Antonio Spurs","SAS","2010s","PG",10.4,1.8,3.2,0.8,0.2],
  ["Bryn Forbes","San Antonio Spurs","SAS","2010s","SG|PG",12.0,2.6,2.0,0.6,0.2],
  ["Matthew Dellavedova","Cleveland Cavaliers","CLE","2010s","PG",6.8,2.8,4.6,1.2,0.2],
  ["Channing Frye","Cleveland Cavaliers","CLE","2010s","PF|C",9.2,4.4,1.2,0.4,0.8],
  ["Richard Jefferson","Cleveland Cavaliers","CLE","2010s","SF|PF",8.4,3.2,1.6,0.8,0.4],
  ["Devin Harris","Dallas Mavericks","DAL","2010s","PG|SG",10.8,2.4,4.0,1.0,0.2],
  ["J.J. Barea","Dallas Mavericks","DAL","2010s","PG",11.4,2.8,5.4,0.8,0.1],
  ["Dorian Finney-Smith","Dallas Mavericks","DAL","2010s","SF|PF",8.8,4.8,1.8,1.0,0.4],
  ["Ed Davis","Portland Trail Blazers","POR","2010s","C|PF",8.0,8.4,1.0,0.6,1.0],
  ["Meyers Leonard","Portland Trail Blazers","POR","2010s","C|PF",8.4,5.8,1.2,0.4,0.8],
  ["Maurice Harkless","Portland Trail Blazers","POR","2010s","SF|PF",9.2,4.2,1.4,1.0,0.6],
  ["Christian Braun","Denver Nuggets","DEN","2020s","SG|SF",9.8,3.8,1.8,0.8,0.3],
  ["DeAndre Jordan","Denver Nuggets","DEN","2020s","C",6.4,8.2,1.2,0.4,1.2],
  ["MarJon Beauchamp","Milwaukee Bucks","MIL","2020s","SF|SG",7.4,3.4,1.4,0.8,0.4],
  ["Malik Beasley","Milwaukee Bucks","MIL","2020s","SG|SF",12.8,3.2,1.8,0.8,0.2],
  ["Maxi Kleber","Dallas Mavericks","DAL","2020s","PF|C",8.4,4.8,1.4,0.6,1.2],
  ["Josh Green","Dallas Mavericks","DAL","2020s","SG|SF",8.0,3.2,2.0,1.0,0.4],
  ["Paul Reed","Philadelphia 76ers","PHI","2020s","C|PF",8.8,7.2,1.4,0.8,1.4],
  ["Buddy Hield","Philadelphia 76ers","PHI","2020s","SG|SF",12.4,3.2,2.0,0.8,0.2],
  ["Sam Hauser","Boston Celtics","BOS","2020s","SF|PF",11.2,3.6,1.6,0.4,0.4],
  ["Payton Pritchard","Boston Celtics","BOS","2020s","PG|SG",10.2,3.0,3.4,0.8,0.2],
  ["Tre Mann","Oklahoma City Thunder","OKC","2020s","SG|PG",12.4,2.8,3.2,0.8,0.3],
  ["Aaron Wiggins","Oklahoma City Thunder","OKC","2020s","SG|SF",10.4,3.8,2.0,1.0,0.4],
  ["Kyle Anderson","Minnesota Timberwolves","MIN","2020s","SF|PF",8.4,4.4,3.2,0.8,0.6],
  ["Monte Morris","Minnesota Timberwolves","MIN","2020s","PG",8.8,2.4,4.4,0.6,0.1],
  ["Malik Monk","Sacramento Kings","SAC","2020s","SG|PG",13.4,2.8,3.2,0.8,0.2],
  ["Isaiah Jackson","Indiana Pacers","IND","2020s","C|PF",8.4,6.4,1.0,0.6,2.0],

  ["Charles Bassey","San Antonio Spurs","SAS","2020s","C|PF",9.4,8.2,1.2,0.6,1.8],
  ["Blake Wesley","San Antonio Spurs","SAS","2020s","SG|PG",9.2,2.6,2.8,0.8,0.3],
  ["Cam Anthony","Los Angeles Lakers","LAL","2020s","SG|PG",8.8,2.4,2.8,0.8,0.3],
  ["Jarred Vanderbilt","Los Angeles Lakers","LAL","2020s","PF|SF",7.4,7.0,1.8,1.2,0.6],
  ["Christian Wood","Los Angeles Lakers","LAL","2020s","C|PF",12.8,7.4,1.4,0.6,1.0],
  ["Jonathan Kuminga","Golden State Warriors","GSW","2020s","SF|PF",14.4,4.4,2.0,0.8,0.6],
  ["Moses Moody","Golden State Warriors","GSW","2020s","SG|SF",9.4,3.0,1.4,0.6,0.4],
  ["Brandin Podziemski","Golden State Warriors","GSW","2020s","SG|PG",9.2,5.4,3.8,1.0,0.3],
  ["Clyde Lovellette","Boston Celtics","BOS","1960s","C|PF",11.2,6.8,1.2,1.0,1.0],
  ["Mel Counts","Boston Celtics","BOS","1960s","C|PF",8.4,7.2,1.0,1.0,1.0],
  ["Jim Barnett","Boston Celtics","BOS","1960s","SG|PG",10.2,2.8,3.2,1.4,0.2],
  ["Wayne Embry","Boston Celtics","BOS","1960s","C",9.4,9.0,1.4,1.0,1.0],
  ["Mal Graham","Boston Celtics","BOS","1960s","SG|PG",8.8,2.4,2.8,1.4,0.2],
  ["Willie Naulls","Golden State Warriors","GSW","1960s","PF|SF",14.8,9.2,1.4,1.0,1.0],
  ["Woody Sauldsberry","Golden State Warriors","GSW","1960s","SF|PF",12.4,7.6,1.2,1.2,0.6],
  ["Frank Radovich","Golden State Warriors","GSW","1960s","C|PF",7.2,8.4,0.8,1.0,1.8],
  ["York Larese","Golden State Warriors","GSW","1960s","SG|PG",9.6,2.2,3.0,1.4,0.2],
  ["Bob Warlick","Golden State Warriors","GSW","1960s","SF|SG",8.4,3.0,2.0,1.2,0.6],
  ["Jim Barnett","Golden State Warriors","GSW","1960s","SG|PG",10.8,3.0,3.4,1.4,0.2],
  ["Fred Hetzel","Golden State Warriors","GSW","1960s","PF|C",13.2,8.4,1.2,1.0,1.0],
  ["Jon McGlocklin","Sacramento Kings","SAC","1960s","SG|PG",11.2,2.8,2.4,1.4,0.2],
  ["Bud Olsen","Sacramento Kings","SAC","1960s","C|PF",6.4,7.4,1.0,1.0,1.8],
  ["Bill Dinwiddie","Sacramento Kings","SAC","1960s","PG|SG",8.4,2.4,3.2,1.2,0.1],
  ["Len Chappell","New York Knicks","NYK","1960s","PF|C",12.8,8.8,1.0,1.0,1.0],
  ["Freddie Crawford","New York Knicks","NYK","1960s","SG|PG",11.4,2.8,3.4,1.4,0.2],
  ["Dave Stallworth","New York Knicks","NYK","1960s","SF|PF",12.2,5.4,1.8,1.2,0.6],
  ["Nate Bowman","New York Knicks","NYK","1960s","C",6.2,6.4,0.8,1.0,1.8],
  ["Howie Komives","New York Knicks","NYK","1960s","PG",13.8,2.6,4.6,1.2,0.1],
  ["Jim Washington","Philadelphia 76ers","PHI","1960s","PF|C",9.8,8.8,1.4,1.0,1.0],
  ["Bob Boozer","Philadelphia 76ers","PHI","1960s","PF|C",13.2,9.4,1.2,1.0,1.0],
  ["Al Bianchi","Philadelphia 76ers","PHI","1960s","SG|PG",10.8,2.6,3.0,1.4,0.2],
  ["Sihugo Green","Atlanta Hawks","ATL","1960s","PG|SG",11.4,3.2,3.8,1.2,0.1],
  ["Charlie Vaughn","Atlanta Hawks","ATL","1960s","SG|PG",10.2,3.0,3.4,1.4,0.2],
  ["John Barnhill","Atlanta Hawks","ATL","1960s","PG|SG",9.8,3.2,4.0,1.2,0.1],
  ["Don Kojis","Chicago Bulls","CHI","1960s","SF|SG",14.8,6.4,1.8,1.2,0.6],
  ["Barry Clemens","Chicago Bulls","CHI","1960s","SF|SG",9.2,3.8,1.8,1.2,0.6],
  ["Jim Burns","Chicago Bulls","CHI","1960s","SG|PG",7.8,2.4,2.8,1.4,0.2],
  ["Jon McGlocklin","Houston Rockets","HOU","1960s","SG|PG",12.4,2.8,2.6,1.4,0.2],
  ["Jim Barnett","Houston Rockets","HOU","1960s","SG|PG",9.8,2.6,2.8,1.4,0.2],
  ["Darrell Imhoff","Los Angeles Lakers","LAL","1960s","C",8.2,9.4,1.4,1.0,1.8],
  ["Walt Hazzard","Los Angeles Lakers","LAL","1960s","PG|SG",12.8,3.4,4.8,1.2,0.1],
  ["Johnny Egan","Los Angeles Lakers","LAL","1960s","PG",10.4,2.4,4.4,1.2,0.1],
  ["John Tresvant","Los Angeles Lakers","LAL","1960s","PF|C",9.4,8.6,1.2,1.0,1.0],
  ["Tom Van Arsdale","Detroit Pistons","DET","1960s","SF|SG",16.4,5.2,2.2,1.2,0.6],
  ["Bill Buntin","Detroit Pistons","DET","1960s","PF|C",9.6,7.4,1.0,1.0,1.0],
  ["Len Chappell","Detroit Pistons","DET","1960s","PF|C",11.8,8.4,1.2,1.0,1.0],
  ["Johnny Green","Washington Wizards","WAS","1960s","C",12.4,13.2,1.4,1.0,1.8],
  ["Ray Scott","Washington Wizards","WAS","1960s","PF|SF",14.2,8.8,2.0,1.0,1.0],
  ["Terry Dischinger","Washington Wizards","WAS","1960s","PF|SF",15.4,7.2,2.0,1.0,1.0],
  ["Art Harris","Phoenix Suns","PHX","1960s","SG|SF",14.2,3.8,2.8,1.4,0.2],
  ["George Wilson","Phoenix Suns","PHX","1960s","C|PF",9.2,10.4,1.2,1.0,1.8],
  ["Stan McKenzie","Phoenix Suns","PHX","1960s","SF|SG",10.8,3.4,2.0,1.2,0.6],
  ["Terry Driscoll","Milwaukee Bucks","MIL","1970s","PF|C",8.4,7.2,1.4,0.8,1.2],
  ["Jim Price","Milwaukee Bucks","MIL","1970s","SG|PG",11.8,2.6,3.6,1.2,0.2],
  ["Kevin Stacom","Boston Celtics","BOS","1970s","SG|PG",8.4,2.4,2.8,1.0,0.2],
  ["Tom Boswell","Boston Celtics","BOS","1970s","PF|C",7.4,5.8,1.0,0.7,0.8],
  ["Hank Finkel","Boston Celtics","BOS","1970s","C",6.8,6.4,1.2,0.5,1.0],
  ["Fred Saunders","Boston Celtics","BOS","1970s","SF|PF",7.2,4.8,1.4,0.8,0.4],
  ["Clyde Lee","Golden State Warriors","GSW","1970s","C|PF",9.2,10.4,1.4,0.7,1.2],
  ["Dwight Davis","Golden State Warriors","GSW","1970s","PF|C",8.4,6.8,1.8,0.9,0.8],
  ["Ron Williams","Golden State Warriors","GSW","1970s","SG|PG",12.0,3.4,4.6,1.2,0.2],
  ["Russ Lee","Golden State Warriors","GSW","1970s","SG|SF",7.8,3.0,2.2,1.2,0.3],
  ["Otto Moore","Houston Rockets","HOU","1970s","C",7.8,8.6,1.4,0.7,1.6],
  ["Dwight Jones","Houston Rockets","HOU","1970s","C|PF",10.4,9.2,1.6,0.8,1.2],
  ["Ed Ratleff","Houston Rockets","HOU","1970s","SF|SG",12.4,4.8,3.2,1.4,0.6],
  ["Jimmy Walker","Houston Rockets","HOU","1970s","SG|PG",14.2,2.4,3.2,1.0,0.2],
  ["Zaid Abdul-Aziz","Houston Rockets","HOU","1970s","PF|C",8.8,10.0,1.0,0.8,1.4],
  ["Lloyd Neal","Portland Trail Blazers","POR","1970s","PF|C",12.4,9.4,1.6,0.8,1.2],
  ["Corky Calhoun","Portland Trail Blazers","POR","1970s","SF|PF",8.4,5.2,1.8,1.0,0.6],
  ["John Johnson","Portland Trail Blazers","POR","1970s","SF|PF",13.8,5.4,4.2,1.2,0.6],
  ["Robin Jones","Portland Trail Blazers","POR","1970s","C|PF",6.4,6.8,1.2,0.6,1.4],
  ["Wally Walker","Portland Trail Blazers","POR","1970s","SF|SG",9.2,3.8,2.0,1.0,0.4],
  ["Warren Jabali","Denver Nuggets","DEN","1970s","SG|PG",14.2,4.2,4.8,1.6,0.2],
  ["Gus Gerard","Denver Nuggets","DEN","1970s","SF|PF",10.4,6.8,2.2,1.0,0.6],
  ["Dolph Schayes Jr.","Denver Nuggets","DEN","1970s","PF|C",7.8,6.2,1.4,0.7,0.8],
  ["Coby Dietrick","Denver Nuggets","DEN","1970s","C|PF",8.4,7.8,1.6,0.7,1.2],
  ["Chuck Williams","Denver Nuggets","DEN","1970s","PG",10.2,2.6,6.2,1.4,0.1],
  ["Lamar Green","Phoenix Suns","PHX","1970s","PF|C",9.4,8.8,1.4,0.9,1.2],
  ["Phil Lumpkin","Phoenix Suns","PHX","1970s","PG",6.8,2.2,4.4,1.2,0.1],
  ["Mike Bantom","Phoenix Suns","PHX","1970s","PF|SF",11.2,7.2,2.4,1.0,0.8],
  ["Nate Hawthorne","Phoenix Suns","PHX","1970s","SF|SG",8.8,3.8,2.0,1.2,0.4],
  ["Willie Norwood","Detroit Pistons","DET","1970s","SF|SG",11.4,5.2,2.2,1.2,0.4],
  ["Harvey Catchings","Detroit Pistons","DET","1970s","C|PF",5.4,7.6,0.8,0.6,2.2],
  ["Terry Tyler","Detroit Pistons","DET","1970s","SF|PF",11.2,6.2,1.4,0.9,2.0],
  ["Kevin Porter","Detroit Pistons","DET","1970s","PG",15.4,4.2,13.4,1.8,0.2],
  ["Ralph Simpson","Detroit Pistons","DET","1970s","SG|PG",16.8,3.6,3.8,1.2,0.2],
  ["Rowland Garrett","Atlanta Hawks","ATL","1970s","SF|SG",9.4,4.2,2.4,1.2,0.4],
  ["Steve Bracey","Atlanta Hawks","ATL","1970s","PG|SG",10.4,2.8,4.2,1.2,0.2],
  ["John Hummer","Los Angeles Clippers","LAC","1970s","PF|C",8.4,7.2,1.4,0.8,0.8],
  ["Matt Guokas","Los Angeles Clippers","LAC","1970s","PG|SG",8.8,2.8,4.6,1.0,0.1],
  ["Bob Weiss","Los Angeles Clippers","LAC","1970s","PG",9.2,2.4,4.8,1.2,0.1],
  ["Dale Schlueter","Los Angeles Clippers","LAC","1970s","C",7.2,8.4,1.2,0.6,1.2],
  ["Mike Gale","Los Angeles Clippers","LAC","1970s","PG|SG",8.8,2.8,4.6,1.6,0.2],
  ["Larry Wright","Washington Wizards","WAS","1970s","PG",10.8,2.4,4.8,1.2,0.1],
  ["Mitch Kupchak","Washington Wizards","WAS","1970s","PF|C",11.4,8.2,1.8,0.8,0.8],
  ["Greg Ballard","Washington Wizards","WAS","1970s","PF|SF",12.4,7.4,2.0,1.0,0.6],
  ["John Rader","Indiana Pacers","IND","1970s","SF|PF",7.4,5.4,1.4,0.8,0.6],
  ["Coby Dietrick","San Antonio Spurs","SAS","1970s","C|PF",8.4,7.8,1.6,0.7,1.2],
  ["Reggie Theus","Chicago Bulls","CHI","1980s","PG|SG",18.4,3.4,6.8,1.0,0.2],
  ["Steve Johnson","Chicago Bulls","CHI","1980s","C",14.2,6.8,1.4,0.6,1.4],
  ["Dave Greenwood","Chicago Bulls","CHI","1980s","PF|C",12.4,8.4,1.8,0.8,0.8],
  ["Artis Gilmore","Chicago Bulls","CHI","1980s","C",17.8,10.4,1.8,0.6,2.8],
  ["Ricky Sobers","Chicago Bulls","CHI","1980s","PG|SG",14.4,3.2,5.6,1.4,0.2],
  ["Mitch Kupchak","Los Angeles Lakers","LAL","1980s","C|PF",8.4,5.8,1.2,0.4,0.6],
  ["Larry Spriggs","Los Angeles Lakers","LAL","1980s","SF|PF",8.2,4.4,1.8,0.8,0.4],
  ["Jerry Sichting","Boston Celtics","BOS","1980s","PG",7.8,1.8,3.8,0.8,0.1],
  ["Kent Benson","Detroit Pistons","DET","1980s","C|PF",9.8,6.4,1.4,0.5,0.8],
  ["Earl Cureton","Detroit Pistons","DET","1980s","PF|C",7.4,5.8,1.2,0.6,0.8],
  ["Caldwell Jones","Houston Rockets","HOU","1980s","C|PF",6.4,8.2,1.4,0.6,2.4],
  ["Elvin Hayes","Houston Rockets","HOU","1980s","C|PF",15.8,9.4,1.6,0.9,2.2],
  ["Billy Paultz","Houston Rockets","HOU","1980s","C",10.2,7.4,1.6,0.7,1.2],
  ["Mike Dunleavy","Houston Rockets","HOU","1980s","PG|SG",9.8,2.4,4.4,0.8,0.2],
  ["Bobby Hansen","Utah Jazz","UTA","1980s","SG|SF",8.2,2.8,2.4,1.0,0.3],
  ["Marc Iavaroni","Utah Jazz","UTA","1980s","PF|SF",7.2,4.6,1.8,0.7,0.5],
  ["Rickey Green","Utah Jazz","UTA","1980s","PG",13.4,2.8,7.8,1.8,0.1],
  ["Eddie Johnson","Atlanta Hawks","ATL","1980s","SG|SF",14.8,3.4,3.2,0.8,0.4],
  ["Artis Gilmore","San Antonio Spurs","SAS","1980s","C",15.4,9.8,1.6,0.6,2.4],
  ["Gene Banks","San Antonio Spurs","SAS","1980s","PF|SF",12.8,5.6,3.2,0.8,0.4],
  ["Sly Williams","New York Knicks","NYK","1980s","SF|SG",14.8,6.2,2.4,1.2,0.6],
  ["Clemon Johnson","Philadelphia 76ers","PHI","1980s","C",7.2,6.8,0.8,0.5,1.4],
  ["Clint Richardson","Philadelphia 76ers","PHI","1980s","SG|PG",10.4,2.8,3.4,1.0,0.2],
  ["Samuel Williams","Philadelphia 76ers","PHI","1980s","C|PF",6.2,5.4,0.8,0.6,2.2],
  ["Will Perdue","Chicago Bulls","CHI","1990s","C",4.6,4.8,0.7,0.3,0.8],
  ["Jud Buechler","Chicago Bulls","CHI","1990s","SF|SG",4.8,2.4,1.4,0.6,0.3],
  ["Stacey King","Chicago Bulls","CHI","1990s","C|PF",6.8,4.4,1.0,0.4,0.8],
  ["Gary Grant","Oklahoma City Thunder","OKC","1990s","PG",7.8,2.4,5.4,1.4,0.2],
  ["Otis Thorpe","Houston Rockets","HOU","1990s","PF|C",14.8,9.6,2.2,0.8,0.6],
  ["Scott Brooks","Houston Rockets","HOU","1990s","PG",8.4,2.0,4.8,1.0,0.1],
  ["David Benoit","Utah Jazz","UTA","1990s","PF|SF",8.4,4.4,1.2,0.6,0.6],
  ["John Crotty","Utah Jazz","UTA","1990s","PG",6.4,1.8,4.4,0.8,0.1],
  ["Herb Williams","New York Knicks","NYK","1990s","C|PF",7.4,6.2,1.2,0.4,1.4],
  ["Dale Ellis","San Antonio Spurs","SAS","1990s","SG|SF",14.8,3.4,1.8,0.8,0.3],
  ["Terry Cummings","San Antonio Spurs","SAS","1990s","PF|SF",14.4,6.8,1.8,0.8,0.8],
  ["Monty Williams","San Antonio Spurs","SAS","1990s","SF|PF",9.4,4.4,2.2,0.8,0.4],
  ["Duane Causwell","Sacramento Kings","SAC","1990s","C",8.4,7.8,0.8,0.6,2.2],
  ["Pete Chilcutt","Sacramento Kings","SAC","1990s","PF|SF",7.8,6.2,1.4,0.6,0.6],
  ["Bobby Hurley","Sacramento Kings","SAC","1990s","PG",8.4,2.4,5.8,1.0,0.1],
  ["Lee Mayberry","Milwaukee Bucks","MIL","1990s","PG",8.4,2.4,5.0,1.2,0.2],
  ["Johnny Newman","Milwaukee Bucks","MIL","1990s","SG|SF",12.8,3.2,2.2,1.0,0.3],
  ["Eric Murdock","Milwaukee Bucks","MIL","1990s","PG",11.2,3.4,6.8,2.4,0.2],
  ["Brad Lohaus","Milwaukee Bucks","MIL","1990s","C|PF",8.8,4.4,1.8,0.6,0.8],
  ["Kwame Brown","Los Angeles Lakers","LAL","2000s","C|PF",6.4,6.8,0.8,0.4,0.8],
  ["Chris Mihm","Los Angeles Lakers","LAL","2000s","C",9.4,7.8,0.8,0.4,1.2],
  ["Joe Smith","Cleveland Cavaliers","CLE","2000s","PF|C",10.2,7.4,1.2,0.6,0.8],
  ["Michael Doleac","Miami Heat","MIA","2000s","C",6.8,5.8,0.8,0.4,0.8],
  ["Devin Harris","Dallas Mavericks","DAL","2000s","PG|SG",14.8,3.2,6.4,1.4,0.2],
  ["Eddie House","Phoenix Suns","PHX","2000s","PG|SG",10.8,2.0,2.8,0.6,0.1],
  ["Marcus Banks","Phoenix Suns","PHX","2000s","PG",6.8,2.4,4.2,1.0,0.2],
  ["Willie Green","Philadelphia 76ers","PHI","2000s","SG|SF",11.4,2.8,2.4,0.8,0.2],
  ["Beno Udrih","San Antonio Spurs","SAS","2000s","PG",8.4,2.4,4.4,0.8,0.1],
  ["Carlos Delfino","Detroit Pistons","DET","2000s","SG|SF",8.4,3.4,2.0,1.0,0.4],
  ["Flip Murray","Detroit Pistons","DET","2000s","SG|PG",10.8,2.8,2.4,0.8,0.2],
  ["Fred Hoiberg","Minnesota Timberwolves","MIN","2000s","SG|SF",9.2,3.2,2.8,0.6,0.2],
  ["Darrick Martin","Minnesota Timberwolves","MIN","2000s","PG",8.8,1.8,5.4,0.8,0.1],
  ["Pat Garrity","Orlando Magic","ORL","2000s","SF|PF",9.5,5.1,1.4,0.5,0.4],
  ["Nikoloz Tskitishvili","Denver Nuggets","DEN","2000s","PF|SF",5.8,4.2,0.8,0.4,0.6],
  ["DerMarr Johnson","Denver Nuggets","DEN","2000s","SF|SG",8.4,3.8,1.8,0.8,0.4],
  ["P.J. Brown","Boston Celtics","BOS","2000s","PF|C",7.8,6.8,1.2,0.8,0.8],
  ["Juwan Howard","Miami Heat","MIA","2010s","PF|C",5.4,4.2,1.2,0.4,0.4],
  ["James Jones","Miami Heat","MIA","2010s","SF|SG",5.6,2.2,1.0,0.4,0.2],
  ["Reggie Jackson","Oklahoma City Thunder","OKC","2010s","PG|SG",13.8,3.6,5.8,1.0,0.3],
  ["Festus Ezeli","Golden State Warriors","GSW","2010s","C",6.2,5.0,0.4,0.4,1.2],
  ["Shaun Livingston","Golden State Warriors","GSW","2010s","PG|SG",10.5,3.4,4.0,0.8,0.5],
  ["Patrick McCaw","Golden State Warriors","GSW","2010s","SG|SF",6.2,2.2,1.6,0.8,0.3],
  ["Michael Carter-Williams","Milwaukee Bucks","MIL","2010s","PG|SG",12.4,5.2,5.8,2.0,1.2],
  ["Omer Asik","New Orleans Pelicans","NOP","2010s","C",7.4,9.4,0.8,0.5,1.0],
  ["Rudy Gay","San Antonio Spurs","SAS","2010s","SF|PF",14.8,5.4,2.4,1.0,0.6],
  ["Dwight Powell","Dallas Mavericks","DAL","2010s","C|PF",9.4,5.8,1.4,0.6,1.0],
  ["Allen Crabbe","Portland Trail Blazers","POR","2010s","SG|SF",10.4,3.0,1.4,0.6,0.3],
  ["Peyton Watson","Denver Nuggets","DEN","2020s","SF|PF",6.8,3.4,1.2,0.8,0.6],
  ["AJ Green","Milwaukee Bucks","MIL","2020s","SG|SF",8.4,2.4,1.4,0.6,0.2],
  ["Dwight Powell","Dallas Mavericks","DAL","2020s","C|PF",7.8,5.4,1.2,0.5,0.6],
  ["Mo Bamba","Philadelphia 76ers","PHI","2020s","C",7.8,6.4,0.8,0.6,1.8],
  ["Luke Kornet","Boston Celtics","BOS","2020s","C",7.4,5.8,1.2,0.6,2.2],
  ["Kenrich Williams","Oklahoma City Thunder","OKC","2020s","SF|PF",7.4,4.8,2.4,1.0,0.4],
  ["Troy Brown Jr.","Minnesota Timberwolves","MIN","2020s","SF|SG",7.8,4.4,2.4,0.8,0.4],
  ["Chris Duarte","Sacramento Kings","SAC","2020s","SG|SF",9.8,3.4,2.0,1.0,0.3],
  ["Trey Lyles","Sacramento Kings","SAC","2020s","PF|C",8.4,5.2,1.8,0.6,0.4],
  ["Doug McDermott","Indiana Pacers","IND","2020s","SF|PF",11.4,3.8,1.6,0.4,0.2],
  ["Sidy Cissoko","San Antonio Spurs","SAS","2020s","SG|SF",6.4,3.0,1.6,0.8,0.4],
  ["Keith Erickson","Los Angeles Lakers","LAL","1970s","SF|SG",9.4,4.2,2.8,1.0,0.4],
  ["John Q. Trapp","Los Angeles Lakers","LAL","1970s","PF|SF",7.6,5.8,1.4,0.8,0.6],
  ["Stu Lantz","Los Angeles Lakers","LAL","1970s","PG|SG",11.4,2.8,3.8,1.2,0.2],
  ["Mel Counts","Los Angeles Lakers","LAL","1970s","C|PF",7.8,7.2,1.6,0.6,0.8],
  ["Bill Bridges","Los Angeles Lakers","LAL","1970s","PF|C",8.2,9.4,2.2,0.8,0.6],
  ["Travis Grant","Los Angeles Lakers","LAL","1970s","SF|PF",7.4,3.4,1.2,0.7,0.4],
  ["Don Ford","Los Angeles Lakers","LAL","1970s","SF|PF",8.8,5.2,1.8,0.8,0.4],
  ["Leroy Ellis","Philadelphia 76ers","PHI","1970s","C|PF",8.4,8.2,1.2,0.6,0.8],
  ["Billy Cunningham","Philadelphia 76ers","PHI","1970s","SF|PF",24.2,10.8,4.6,1.8,1.0],
  ["Tom Van Arsdale","Philadelphia 76ers","PHI","1970s","SF|SG",14.8,4.4,2.4,1.0,0.3],
  ["Clyde Lee","Philadelphia 76ers","PHI","1970s","C|PF",7.4,9.8,1.2,0.6,0.8],
  ["Don May","Philadelphia 76ers","PHI","1970s","SF|PF",8.4,4.8,1.4,0.8,0.4],
  ["Manny Leaks","Philadelphia 76ers","PHI","1970s","C|PF",6.4,7.6,0.8,0.6,0.8],
  ["Gus Williams","Philadelphia 76ers","PHI","1970s","PG|SG",12.4,2.8,4.8,2.0,0.2],
  ["Mike Bantom","Philadelphia 76ers","PHI","1970s","PF|SF",10.8,6.8,2.2,1.0,0.6],
  ["Terry Furlow","Philadelphia 76ers","PHI","1970s","SG|SF",12.4,3.4,2.4,1.0,0.2],
  ["Mark West","Phoenix Suns","PHX","1990s","C",6.8,6.4,0.6,0.4,1.4],
  ["Negele Knight","Phoenix Suns","PHX","1990s","PG",8.4,2.4,4.8,1.0,0.1],
  ["Frank Johnson","Phoenix Suns","PHX","1990s","PG|SG",7.2,2.2,5.2,1.2,0.1],
  ["Richard Dumas","Phoenix Suns","PHX","1990s","SF|SG",12.8,4.2,1.8,1.2,0.4],
  ["Jerrod Mustaf","Phoenix Suns","PHX","1990s","PF|SF",7.4,4.6,1.2,0.6,0.6],
  ["Joe Kleine","Phoenix Suns","PHX","1990s","C|PF",6.2,6.0,1.2,0.4,0.6],
  ["Wayman Tisdale","Phoenix Suns","PHX","1990s","PF|C",15.4,6.6,1.4,0.6,0.5],
  ["Oliver Miller","Phoenix Suns","PHX","1990s","C|PF",8.8,7.8,2.8,0.8,1.8],
  ["Hot Rod Williams","Phoenix Suns","PHX","1990s","PF|C",10.4,7.2,2.0,0.8,1.6],
  ["Tony Battie","Orlando Magic","ORL","2000s","PF|C",8.4,7.6,0.8,0.6,1.4],
  ["Stevie Francis","Orlando Magic","ORL","2000s","PG|SG",16.4,5.0,5.8,1.4,0.4],
  ["Kelvin Cato","Orlando Magic","ORL","2000s","C",6.2,7.4,0.6,0.6,2.2],
  ["DeShawn Stevenson","Orlando Magic","ORL","2000s","SG|SF",8.8,3.2,2.0,1.2,0.4],
  ["Carlos Arroyo","Orlando Magic","ORL","2000s","PG",10.4,2.8,5.2,0.8,0.2],
  ["Keyon Dooling","Orlando Magic","ORL","2000s","PG|SG",8.8,2.4,4.2,1.0,0.2],
  ["Trevor Ariza","Orlando Magic","ORL","2000s","SF|PF",7.4,4.2,1.8,1.0,0.8],
  ["Tyronn Lue","Orlando Magic","ORL","2000s","PG",7.2,1.8,4.4,0.8,0.1],
  ["Rich Jones","San Antonio Spurs","SAS","1970s","SF|PF",12.4,5.8,2.4,1.2,0.4],
  ["Fatty Taylor","San Antonio Spurs","SAS","1970s","PG|SG",9.2,2.6,5.2,1.4,0.1],
  ["Paul Griffin","San Antonio Spurs","SAS","1970s","PF|SF",6.8,7.4,2.8,1.0,0.4],
  ["Dave Corzine","San Antonio Spurs","SAS","1970s","C",8.8,6.4,1.4,0.5,1.0],
  ["Foots Walker","Indiana Pacers","IND","1970s","PG",8.2,3.4,6.8,1.6,0.1],
  ["Dave Robisch","Indiana Pacers","IND","1970s","C|PF",12.4,7.8,2.2,0.7,0.8],
  ["James McElroy","Indiana Pacers","IND","1970s","PG|SG",10.4,2.6,4.8,1.2,0.1],
  ["Herb Williams","Indiana Pacers","IND","1970s","C|PF",11.4,6.8,1.4,0.6,1.8],
  ["George McGinnis","Indiana Pacers","IND","1970s","PF|SF",25.8,13.4,4.8,2.0,1.2],
  ["Kiki Vandeweghe","Portland Trail Blazers","POR","1980s","SF|PF",24.8,5.4,2.4,0.8,0.4],
  ["Fat Lever","Portland Trail Blazers","POR","1980s","PG|SG",12.4,4.8,6.4,2.2,0.4],
  ["Wayne Cooper","Portland Trail Blazers","POR","1980s","C|PF",8.4,7.8,1.4,0.6,2.2],
  ["Kenny Carr","Portland Trail Blazers","POR","1980s","PF|SF",12.8,7.4,1.8,0.8,0.6],
  ["T.R. Dunn","Portland Trail Blazers","POR","1980s","SG|SF",6.4,4.8,2.4,1.8,0.4],
  ["Audie Norris","Portland Trail Blazers","POR","1980s","PF|C",6.8,5.6,1.2,0.6,0.8],
  ["Pete Verhoeven","Portland Trail Blazers","POR","1980s","PF|C",5.8,5.2,1.0,0.5,0.6],
    ["Rony Seikaly","Orlando Magic","ORL","1990s","C|PF",13.8,9.4,1.4,0.6,1.4],
  ["Jon Koncak","Orlando Magic","ORL","1990s","C",5.2,6.4,0.8,0.5,1.4],
  ["Penny Hardaway","Orlando Magic","ORL","1990s","PG|SG",20.6,4.6,7.2,1.8,0.8],
  ["Derek Strong","Orlando Magic","ORL","1990s","PF|C",8.4,7.8,1.2,0.8,0.8],
  ["Darrell Armstrong","Orlando Magic","ORL","1990s","PG",10.8,2.8,5.2,1.8,0.2],
  ["Gerald Wilkins","Orlando Magic","ORL","1990s","SG|SF",11.4,3.4,2.4,1.0,0.3],
  ["Danny Schayes","Orlando Magic","ORL","1990s","C|PF",8.8,6.8,1.4,0.4,0.8],
  ["Felton Spencer","Orlando Magic","ORL","1990s","C",5.8,6.4,0.6,0.3,1.2],
  ["Haywoode Workman","Indiana Pacers","IND","1990s","PG|SG",8.4,3.4,6.8,1.8,0.2],
  ["Sam Mitchell","Indiana Pacers","IND","1990s","SF|PF",10.4,5.2,1.6,0.8,0.4],
  ["Pooh Richardson","Indiana Pacers","IND","1990s","PG",11.8,3.4,7.8,1.4,0.2],
  ["Derrick McKey","Indiana Pacers","IND","1990s","SF|PF",12.4,6.0,2.8,1.4,0.8],
  ["Byron Scott","Indiana Pacers","IND","1990s","SG|SF",10.8,2.8,2.4,1.0,0.2],
  ["Duane Ferrell","Indiana Pacers","IND","1990s","SF|SG",8.8,3.8,1.8,0.8,0.4],
  ["Eddie Johnson","Indiana Pacers","IND","1990s","SG|SF",12.4,3.4,2.0,0.6,0.3],
  ["Ricky Davis","Cleveland Cavaliers","CLE","2000s","SG|SF",16.8,4.8,3.4,1.2,0.4],
  ["Carlos Boozer","Cleveland Cavaliers","CLE","2000s","PF|C",15.6,10.6,1.8,0.6,0.4],
  ["Dajuan Wagner","Cleveland Cavaliers","CLE","2000s","PG|SG",14.8,2.6,4.2,0.8,0.2],
  ["Ira Newble","Cleveland Cavaliers","CLE","2000s","SF|SG",6.8,3.8,1.6,1.2,0.4],
  ["Scot Pollard","Cleveland Cavaliers","CLE","2000s","C|PF",5.4,6.4,0.8,0.5,0.8],
  ["Eric Snow","Cleveland Cavaliers","CLE","2000s","PG",7.8,2.8,5.8,1.2,0.2],
  ["Flip Murray","Cleveland Cavaliers","CLE","2000s","SG|PG",10.4,2.8,2.6,0.8,0.2],
  ["Aleksandar Pavlovic","Cleveland Cavaliers","CLE","2000s","SG|SF",8.8,3.2,1.8,0.8,0.3],
  ["Caron Butler","Miami Heat","MIA","2000s","SF|SG",15.4,5.4,2.8,1.4,0.4],
  ["Brian Grant","Miami Heat","MIA","2000s","PF|C",9.4,8.4,1.2,0.6,0.6],
  ["Lamar Odom","Miami Heat","MIA","2000s","PF|SF",16.4,9.8,4.2,1.2,0.6],
  ["Keyon Dooling","Miami Heat","MIA","2000s","PG|SG",7.4,1.8,3.4,0.8,0.2],
  ["Rasual Butler","Miami Heat","MIA","2000s","SF|SG",9.8,3.4,1.4,0.8,0.4],
  ["Dorell Wright","Miami Heat","MIA","2000s","SF|PF",8.4,4.2,2.0,0.8,0.4],
  ["Jumaine Jones","Philadelphia 76ers","PHI","2000s","SF|PF",7.8,5.4,1.4,0.8,0.4],
  ["Matt Geiger","Philadelphia 76ers","PHI","2000s","C|PF",10.4,7.8,1.0,0.4,0.8],
  ["Tyrone Hill","Philadelphia 76ers","PHI","2000s","PF|C",8.4,9.2,0.8,0.6,0.6],
  ["Nazr Mohammed","Philadelphia 76ers","PHI","2000s","C",9.4,8.6,0.8,0.4,1.0],
  ["Todd MacCulloch","Philadelphia 76ers","PHI","2000s","C",8.2,6.8,0.6,0.3,1.0],
  ["Monty Williams","Philadelphia 76ers","PHI","2000s","SF|PF",6.8,4.4,1.4,0.6,0.4],
  ["Raja Bell","Philadelphia 76ers","PHI","2000s","SG|SF",8.8,2.8,1.8,1.2,0.3],
  ["Wally Szczerbiak","Minnesota Timberwolves","MIN","2000s","SF|SG",18.4,4.6,2.4,0.8,0.3],
  ["Anthony Peeler","Minnesota Timberwolves","MIN","2000s","SG|SF",11.8,3.4,2.6,1.0,0.3],
  ["Ervin Johnson","Minnesota Timberwolves","MIN","2000s","C",5.8,8.4,0.8,0.5,1.8],
  ["Gary Trent","Minnesota Timberwolves","MIN","2000s","PF|SF",9.4,5.8,1.2,0.6,0.4],
  ["Bobby Jackson","Minnesota Timberwolves","MIN","2000s","PG|SG",14.8,3.4,4.8,1.4,0.2],
  ["Oliver Miller","Minnesota Timberwolves","MIN","2000s","C|PF",7.4,6.8,2.4,0.6,1.2],
  ["Rasho Nesterovic","Minnesota Timberwolves","MIN","2000s","C",7.4,6.2,1.0,0.4,1.0],
  ["Marcus Banks","Minnesota Timberwolves","MIN","2000s","PG",7.4,2.4,4.0,1.0,0.2],
  ["Kevin McHale","Houston Rockets","HOU","2010s","PF|C",8.4,5.2,1.2,0.4,1.8],
  ["Patrick Beverley","Houston Rockets","HOU","2010s","PG|SG",9.4,5.2,3.8,2.0,0.4],
  ["Chandler Parsons","Houston Rockets","HOU","2010s","SF|PF",16.4,6.0,3.8,1.0,0.4],
  ["Omer Asik","Houston Rockets","HOU","2010s","C",9.4,11.2,0.8,0.5,1.2],
  ["Jeremy Lin","Houston Rockets","HOU","2010s","PG",14.6,3.4,6.4,1.0,0.2],
  ["Donatas Motiejunas","Houston Rockets","HOU","2010s","PF|C",11.8,5.4,1.8,0.6,0.8],
  ["Jason Terry","Houston Rockets","HOU","2010s","SG|PG",9.4,2.4,3.4,0.8,0.2],
  ["Tarik Black","Houston Rockets","HOU","2010s","C|PF",6.8,6.4,0.6,0.4,0.8],
  ["Solomon Hill","New Orleans Pelicans","NOP","2010s","SF|PF",7.4,4.4,1.8,0.8,0.4],
  ["Dante Cunningham","New Orleans Pelicans","NOP","2010s","PF|SF",7.8,5.2,1.4,0.8,0.6],
  ["Kendrick Perkins","New Orleans Pelicans","NOP","2010s","C",4.4,5.4,1.0,0.4,0.6],
  ["Tim Frazier","New Orleans Pelicans","NOP","2010s","PG",7.4,3.4,6.4,1.2,0.2],
  ["Langston Galloway","New Orleans Pelicans","NOP","2010s","SG|PG",8.8,2.6,2.0,0.8,0.2],
  ["Terrence Jones","New Orleans Pelicans","NOP","2010s","PF|SF",9.8,6.4,1.8,0.8,0.8],
  ["Ian Clark","New Orleans Pelicans","NOP","2010s","SG|PG",8.8,2.2,2.2,0.6,0.2],
  ["Cheick Diallo","New Orleans Pelicans","NOP","2010s","PF|C",7.4,6.2,0.8,0.6,0.8],
  ["Anderson Varejao","Cleveland Cavaliers","CLE","2010s","C|PF",8.4,10.4,1.8,0.8,1.0],
  ["Mo Williams","Cleveland Cavaliers","CLE","2010s","PG|SG",14.8,3.2,5.4,1.0,0.2],
  ["Brendan Haywood","Cleveland Cavaliers","CLE","2010s","C",5.4,6.4,0.8,0.4,1.0],
  ["Jordan McRae","Cleveland Cavaliers","CLE","2010s","SG|SF",8.4,2.4,1.8,0.6,0.2],
  ["DeAndre Liggins","Cleveland Cavaliers","CLE","2010s","SG|SF",5.4,2.8,1.8,1.0,0.2],
  ["Mike Dunleavy Jr.","Cleveland Cavaliers","CLE","2010s","SF|PF",8.8,3.8,2.4,0.6,0.4],
  ["Kay Felder","Cleveland Cavaliers","CLE","2010s","PG",6.4,2.0,3.8,0.8,0.1],
  ["Jordan Clarkson","Cleveland Cavaliers","CLE","2010s","PG|SG",14.6,3.2,3.4,0.6,0.3],
  ["Monta Ellis","Dallas Mavericks","DAL","2010s","SG|PG",19.4,3.8,5.8,1.4,0.3],
  ["Samuel Dalembert","Dallas Mavericks","DAL","2010s","C",7.4,8.4,0.8,0.6,1.4],
  ["Rajon Rondo","Dallas Mavericks","DAL","2010s","PG",8.0,4.8,8.8,1.6,0.4],
  ["Raymond Felton","Dallas Mavericks","DAL","2010s","PG",10.4,2.8,5.4,1.0,0.2],
  ["Al-Farouq Aminu","Dallas Mavericks","DAL","2010s","SF|PF",8.4,5.8,1.8,1.0,0.6],
  ["Charlie Villanueva","Dallas Mavericks","DAL","2010s","PF|SF",8.4,4.8,1.2,0.4,0.6],
  ["Seth Curry","Dallas Mavericks","DAL","2010s","PG|SG",12.4,2.4,2.8,0.8,0.2],
  ["Bruce Brown","Denver Nuggets","DEN","2020s","SG|SF",10.8,4.4,3.4,1.0,0.4],
  ["Vlatko Cancar","Denver Nuggets","DEN","2020s","SF|PF",7.4,3.8,1.6,0.6,0.4],
  ["Thomas Bryant","Denver Nuggets","DEN","2020s","C|PF",9.8,6.8,1.2,0.4,1.2],
  ["Kentavious Caldwell-Pope","Denver Nuggets","DEN","2020s","SG|SF",13.4,3.2,2.4,1.2,0.3],
  ["Bones Hyland","Denver Nuggets","DEN","2020s","PG|SG",11.8,2.8,3.4,0.8,0.2],
  ["Wesley Matthews","Milwaukee Bucks","MIL","2020s","SG|SF",8.4,3.2,1.6,1.0,0.3],
  ["Jordan Nwora","Milwaukee Bucks","MIL","2020s","SF|PF",8.0,4.0,1.2,0.6,0.4],
  ["George Hill","Milwaukee Bucks","MIL","2020s","PG|SG",8.4,2.8,3.8,1.0,0.3],
  ["Jevon Carter","Milwaukee Bucks","MIL","2020s","PG|SG",7.8,2.4,3.2,1.4,0.3],
  ["Spencer Dinwiddie","Dallas Mavericks","DAL","2020s","PG|SG",16.8,3.8,6.4,0.8,0.3],
  ["Christian Wood","Dallas Mavericks","DAL","2020s","C|PF",16.8,7.4,1.6,0.6,1.0],
  ["Reggie Bullock","Dallas Mavericks","DAL","2020s","SF|SG",10.4,3.4,1.8,0.8,0.4],
  ["Frank Ntilikina","Dallas Mavericks","DAL","2020s","PG|SG",6.4,2.8,3.4,1.2,0.4],
  ["Theo Pinson","Dallas Mavericks","DAL","2020s","SF|SG",5.4,3.2,2.4,0.8,0.3],
  ["Matisse Thybulle","Philadelphia 76ers","PHI","2020s","SG|SF",6.4,2.8,1.4,1.8,1.2],
  ["Danny Green","Philadelphia 76ers","PHI","2020s","SG|SF",7.8,3.2,1.8,1.0,0.4],
  ["Shake Milton","Philadelphia 76ers","PHI","2020s","SG|PG",11.4,3.2,3.4,0.6,0.3],
  ["Isaiah Joe","Philadelphia 76ers","PHI","2020s","SG|SF",7.4,2.4,1.8,0.6,0.3],
  ["Robert Williams III","Boston Celtics","BOS","2020s","C",9.4,9.6,1.8,0.8,2.2],
  ["Derrick White","Boston Celtics","BOS","2020s","PG|SG",12.4,4.2,5.0,1.6,1.4],
  ["Malcolm Brogdon","Boston Celtics","BOS","2020s","PG|SG",14.8,4.2,3.8,0.8,0.4],
  ["Nik Stauskas","Boston Celtics","BOS","2020s","SG|SF",5.4,2.0,1.8,0.4,0.2],
  ["Aleksej Pokusevski","Oklahoma City Thunder","OKC","2020s","PF|SF",7.5,5.5,1.8,0.8,1.0],
  ["Lindy Waters III","Oklahoma City Thunder","OKC","2020s","SF|SG",6.4,3.2,1.4,0.6,0.3],
  ["Darius Bazley","Oklahoma City Thunder","OKC","2020s","PF|SF",11.4,6.8,1.8,0.8,0.8],
  ["Theo Maledon","Oklahoma City Thunder","OKC","2020s","PG|SG",9.4,3.4,4.4,0.8,0.2],
  ["Mike Muscala","Oklahoma City Thunder","OKC","2020s","C|PF",8.4,4.8,1.8,0.4,0.8],
  ["Jordan McLaughlin","Minnesota Timberwolves","MIN","2020s","PG",6.8,2.8,5.2,1.2,0.2],
  ["Taurean Prince","Minnesota Timberwolves","MIN","2020s","SF|PF",9.4,3.8,1.8,0.8,0.4],
  ["Austin Rivers","Minnesota Timberwolves","MIN","2020s","PG|SG",7.8,2.4,3.4,0.8,0.2],
  ["Wendell Moore Jr.","Minnesota Timberwolves","MIN","2020s","SG|SF",6.4,2.8,2.4,0.6,0.2],
  ["Luka Garza","Minnesota Timberwolves","MIN","2020s","C|PF",7.4,4.4,0.8,0.3,0.4],
  ["Richaun Holmes","Sacramento Kings","SAC","2020s","C|PF",12.4,8.4,1.6,0.8,1.4],
  ["Terence Davis","Sacramento Kings","SAC","2020s","SG|SF",11.4,3.4,2.2,1.0,0.4],
  ["Justin Holiday","Sacramento Kings","SAC","2020s","SF|SG",8.4,3.4,1.8,1.0,0.4],
  ["Chimezie Metu","Sacramento Kings","SAC","2020s","PF|C",8.8,4.8,1.4,0.6,0.8],
  ["Marvin Bagley III","Sacramento Kings","SAC","2020s","PF|C",13.8,7.4,1.2,0.4,1.1],
  ["Chris Duarte","Indiana Pacers","IND","2020s","SG|SF",13.4,4.2,2.4,1.0,0.4],
  ["Oshae Brissett","Indiana Pacers","IND","2020s","SF|PF",9.4,5.8,1.8,0.8,0.6],
  ["Jalen Smith","Indiana Pacers","IND","2020s","PF|C",9.4,6.8,1.2,0.6,1.2],
  ["Aaron Nesmith","Indiana Pacers","IND","2020s","SF|SG",9.8,4.4,1.8,0.8,0.4],
  ["Goga Bitadze","Indiana Pacers","IND","2020s","C|PF",8.8,6.4,1.4,0.5,1.4],
  ["Dominick Barlow","San Antonio Spurs","SAS","2020s","PF|C",7.4,5.8,1.2,0.5,0.8],
  ["Julian Champagnie","San Antonio Spurs","SAS","2020s","SF|PF",9.9,5.8,1.4,0.7,0.5],
  ["Patrick Beverley","Los Angeles Lakers","LAL","2020s","PG|SG",7.4,3.8,3.4,1.4,0.2],
  ["Juan Toscano-Anderson","Los Angeles Lakers","LAL","2020s","SF|PF",6.4,3.8,2.4,0.8,0.4],
  ["Dennis Schroder","Los Angeles Lakers","LAL","2020s","PG|SG",15.4,3.4,5.8,1.0,0.2],
  ["Lonnie Walker IV","Los Angeles Lakers","LAL","2020s","SG|SF",12.8,3.2,1.8,0.8,0.3],
  ["Troy Brown Jr.","Los Angeles Lakers","LAL","2020s","SF|SG",7.8,4.4,2.4,0.8,0.4],
  ["Otto Porter Jr.","Golden State Warriors","GSW","2020s","SF|PF",8.4,4.8,1.8,0.8,0.4],
  ["Nemanja Bjelica","Golden State Warriors","GSW","2020s","PF|SF",7.8,4.4,2.4,0.5,0.4],
  ["Chris Chiozza","Golden State Warriors","GSW","2020s","PG",5.4,2.2,3.8,0.8,0.1],
  ["JaMychal Green","Golden State Warriors","GSW","2020s","PF|C",7.8,5.4,1.2,0.6,0.6],
  ["Anthony Lamb","Golden State Warriors","GSW","2020s","SF|PF",6.8,3.8,1.4,0.6,0.4],

  ["Lou Hudson","Atlanta Hawks","ATL","1960s","SG|SF",26.8,5.0,3.9,1.2,0.6],
  ["Don Ohl","Atlanta Hawks","ATL","1960s","SG|PG",16.8,2.6,3.6,1.4,0.2],
  ["Paul Silas","Atlanta Hawks","ATL","1960s","PF|C",10.8,12.2,2.0,1.0,1.0],
  ["Walt Hazzard","Atlanta Hawks","ATL","1960s","PG|SG",12.2,3.2,5.4,1.2,0.1],










  ["Ollie Johnson","Sacramento Kings","SAC","1970s","SF|SG",9.4,4.2,2.2,1.2,0.4],
  ["Bill Robinzine","Sacramento Kings","SAC","1970s","PF|C",11.4,7.8,1.6,0.9,0.8],
  ["Phil Ford","Sacramento Kings","SAC","1970s","PG",13.8,2.8,7.8,1.4,0.1],
  ["Scott Wedman","Sacramento Kings","SAC","1970s","SF|SG",14.4,5.2,2.4,1.0,0.4],
  ["Marvin Barnes","Sacramento Kings","SAC","1970s","PF|C",14.4,10.4,2.2,1.0,1.0],
  ["John Gianelli","Sacramento Kings","SAC","1970s","C|PF",10.2,8.2,1.4,0.8,1.6],
  ["Mike D'Antoni","Sacramento Kings","SAC","1970s","PG|SG",8.4,2.4,5.2,1.2,0.1],
  ["Glen Gondrezick","Sacramento Kings","SAC","1970s","SG|SF",9.2,3.8,2.4,1.4,0.3],

  ["Bill Bridges","Atlanta Hawks","ATL","1970s","PF|C",10.8,11.4,2.8,1.0,0.8],
  ["Eddie Johnson","Atlanta Hawks","ATL","1970s","SG|SF",13.4,3.4,3.0,1.0,0.3],
  ["Tree Rollins","Atlanta Hawks","ATL","1970s","C",7.4,6.8,0.8,0.6,2.8],

  ["Tom McMillen","New York Knicks","NYK","1970s","PF|C",9.8,5.4,1.6,0.8,0.8],
  ["Toby Knight","New York Knicks","NYK","1970s","PF|SF",11.4,6.2,1.8,0.9,0.6],
  ["Lonnie Shelton","New York Knicks","NYK","1970s","PF|C",13.8,6.8,1.8,1.0,0.8],
  ["Ray Williams","New York Knicks","NYK","1970s","PG|SG",16.8,4.4,5.6,1.6,0.3],
  ["Micheal Ray Richardson","New York Knicks","NYK","1970s","PG|SG",18.4,5.4,7.6,2.8,0.5],
  ["Marvin Webster","New York Knicks","NYK","1970s","C",12.4,11.4,1.4,0.6,2.4],

  ["Spencer Haywood","Utah Jazz","UTA","1970s","PF|C",21.8,10.4,2.0,1.0,1.2],
  ["Ron Behagen","Utah Jazz","UTA","1970s","PF|C",10.4,7.2,1.8,0.8,0.8],
  ["Bernard King","Utah Jazz","UTA","1970s","SF|SG",24.2,5.8,3.4,1.2,0.4],

  ["Charles Johnson","Washington Wizards","WAS","1970s","SG|SF",10.4,3.2,2.8,1.2,0.3],

  ["John Drew","Atlanta Hawks","ATL","1980s","SF|PF",17.8,6.8,2.2,1.2,0.6],
  ["Dan Roundfield","Atlanta Hawks","ATL","1980s","PF|C",15.2,10.2,2.4,1.4,2.2],
  ["Rory Sparrow","Atlanta Hawks","ATL","1980s","PG",9.8,2.8,6.2,1.0,0.2],
  ["John Battle","Atlanta Hawks","ATL","1980s","PG|SG",12.4,2.4,4.8,1.0,0.2],
  ["Cliff Levingston","Atlanta Hawks","ATL","1980s","PF|SF",10.4,6.4,1.4,0.8,0.8],
  ["Duane Ferrell","Atlanta Hawks","ATL","1980s","SF|SG",9.2,3.8,1.8,0.8,0.4],
  ["Sly Williams","Atlanta Hawks","ATL","1980s","SF|SG",14.8,6.2,2.4,1.2,0.6],
  ["John Koncak","Atlanta Hawks","ATL","1980s","C",5.2,6.5,0.9,0.7,2.1],
  ["Rickey Brown","Atlanta Hawks","ATL","1980s","PF|C",8.4,6.2,1.2,0.6,0.8],
  ["Scott Hastings","Atlanta Hawks","ATL","1980s","PF|C",7.4,4.8,1.4,0.6,0.6],

  ["Micheal Ray Richardson","New York Knicks","NYK","1980s","PG|SG",16.8,5.4,7.2,2.8,0.5],
  ["Ray Williams","New York Knicks","NYK","1980s","PG|SG",16.4,4.2,5.4,1.6,0.3],
  ["Truck Robinson","New York Knicks","NYK","1980s","PF|C",12.4,9.4,2.2,0.8,0.6],
  ["Marvin Webster","New York Knicks","NYK","1980s","C",10.4,9.8,1.2,0.6,2.0],
  ["Mel Cartwright","New York Knicks","NYK","1980s","PF|C",8.4,6.2,1.4,0.6,0.8],
  ["Pat Cummings","New York Knicks","NYK","1980s","C|PF",13.2,8.4,1.4,0.6,0.6],
  ["Sedric Toney","New York Knicks","NYK","1980s","PG|SG",8.8,2.4,4.4,1.2,0.2],
  ["Kenny Walker","New York Knicks","NYK","1980s","SF|PF",12.4,5.4,1.4,0.8,0.6],
  ["Johnny Newman","New York Knicks","NYK","1980s","SG|SF",13.8,3.2,2.4,1.0,0.3],
  ["Sidney Green","New York Knicks","NYK","1980s","PF|C",9.2,7.8,1.8,0.6,0.6],
  ["Jawann Oldham","New York Knicks","NYK","1980s","C",6.8,5.4,0.8,0.5,2.2],

  ["Willie Anderson","San Antonio Spurs","SAS","1990s","SG|SF",14.8,4.4,4.8,1.3,0.6],
  ["Rod Strickland","San Antonio Spurs","SAS","1990s","PG",14.2,4.4,8.8,1.8,0.2],
  ["Antoine Carr","San Antonio Spurs","SAS","1990s","PF|C",12.4,5.8,1.4,0.7,0.8],
  ["Doc Rivers","San Antonio Spurs","SAS","1990s","PG|SG",9.4,3.4,6.2,1.6,0.2],
  ["Cory Alexander","San Antonio Spurs","SAS","1990s","PG",7.8,2.4,4.8,1.4,0.2],
  ["Carl Herrera","San Antonio Spurs","SAS","1990s","PF|SF",7.6,5.9,1.2,0.8,0.8],
  ["Jack Haley","San Antonio Spurs","SAS","1990s","C",4.2,4.4,0.6,0.3,0.4],
  ["Byron Russell","San Antonio Spurs","SAS","1990s","SF|SG",8.4,3.4,1.8,0.9,0.3],
  ["Felton Spencer","San Antonio Spurs","SAS","1990s","C",6.4,7.4,0.6,0.3,1.0],

  ["Marquis Daniels","Dallas Mavericks","DAL","2000s","SG|SF",11.4,3.8,2.8,1.4,0.4],
  ["Travis Outlaw","Dallas Mavericks","DAL","2000s","SF|PF",10.4,4.2,1.4,0.8,0.4],
  ["Alan Henderson","Dallas Mavericks","DAL","2000s","PF|C",8.8,7.2,1.2,0.6,0.6],
  ["DJ Mbenga","Dallas Mavericks","DAL","2000s","C",4.2,4.0,0.4,0.4,1.2],
  ["Austin Croshere","Dallas Mavericks","DAL","2000s","PF|SF",9.4,5.2,1.8,0.6,0.6],
  ["Devean George","Dallas Mavericks","DAL","2000s","SF|SG",8.6,3.8,1.4,0.8,0.6],

  ["Matt Bonner","San Antonio Spurs","SAS","2000s","PF|C",7.4,4.2,0.8,0.4,0.4],
  ["Ime Udoka","San Antonio Spurs","SAS","2000s","SF|SG",5.8,2.8,1.8,0.8,0.4],
  ["Francisco Elson","San Antonio Spurs","SAS","2000s","C",6.2,5.4,0.8,0.6,1.0],
  ["Brent Barry","San Antonio Spurs","SAS","2000s","SG|SF",9.8,2.8,3.8,1.0,0.2],
  ["Nick Van Exel","San Antonio Spurs","SAS","2000s","PG",12.4,2.8,6.4,0.8,0.2],
  ["Hedo Turkoglu","San Antonio Spurs","SAS","2000s","SF|PF",10.4,4.8,2.4,0.9,0.4],
  ["Jacque Vaughn","San Antonio Spurs","SAS","2000s","PG",5.4,1.8,3.8,0.8,0.1],
  ["Malik Rose","San Antonio Spurs","SAS","2000s","PF|C",9.4,7.2,1.4,0.6,0.6],

  ["Voshon Lenard","Denver Nuggets","DEN","2000s","SG|SF",12.4,2.8,2.4,0.8,0.2],
  ["Mark Blount","Denver Nuggets","DEN","2000s","C",9.8,6.8,0.8,0.5,1.0],
  ["Julius Hodge","Denver Nuggets","DEN","2000s","SF|SG",6.4,3.2,2.4,0.8,0.3],
  ["Ricky Davis","Denver Nuggets","DEN","2000s","SG|SF",14.8,4.2,3.4,1.2,0.4],
  ["Anthony Carter","Denver Nuggets","DEN","2000s","PG",6.8,2.4,4.8,1.2,0.2],

  ["Brian Grant","Phoenix Suns","PHX","2000s","PF|C",8.4,7.8,1.2,0.6,0.6],
  ["Jalen Rose","Phoenix Suns","PHX","2000s","SF|SG",14.4,4.2,4.8,1.0,0.3],
  ["Quentin Richardson","Phoenix Suns","PHX","2000s","SG|SF",14.8,5.4,2.2,0.9,0.4],
  ["Pat Burke","Phoenix Suns","PHX","2000s","C|PF",6.4,4.8,0.8,0.4,0.6],
  ["Zarko Cabarkapa","Phoenix Suns","PHX","2000s","SF|PF",7.8,3.8,1.6,0.6,0.4],
  ["Casey Jacobsen","Phoenix Suns","PHX","2000s","SG|SF",7.2,2.8,1.6,0.6,0.2],
  ["Sean Marks","Phoenix Suns","PHX","2000s","C|PF",5.2,4.2,0.8,0.4,0.6],

  ["Brian Scalabrine","Boston Celtics","BOS","2000s","PF|SF",4.8,3.2,1.4,0.4,0.4],
  ["Scot Pollard","Boston Celtics","BOS","2000s","C|PF",5.8,5.8,0.8,0.4,0.8],
  ["Michael Finley","Boston Celtics","BOS","2000s","SG|SF",9.4,2.8,1.8,0.7,0.2],
  ["Stephon Marbury","Boston Celtics","BOS","2000s","PG",13.4,2.8,5.4,1.0,0.2],
  ["Bill Walker","Boston Celtics","BOS","2000s","SG|SF",8.4,3.2,1.8,0.8,0.3],
  ["Mikki Moore","Boston Celtics","BOS","2000s","C",8.2,6.4,0.8,0.5,1.4],

  ["Chris Andersen","Miami Heat","MIA","2010s","C|PF",5.8,5.4,0.8,0.7,1.8],
  ["Greg Oden","Miami Heat","MIA","2010s","C",4.2,5.2,0.8,0.4,1.2],
  ["Luol Deng","Miami Heat","MIA","2010s","SF|PF",11.4,5.8,2.4,1.2,0.6],
  ["Goran Dragic","Miami Heat","MIA","2010s","PG|SG",17.4,4.0,5.8,1.2,0.2],
  ["Justise Winslow","Miami Heat","MIA","2010s","SF|SG",11.2,5.8,4.4,1.4,0.6],
  ["Josh McRoberts","Miami Heat","MIA","2010s","PF|SF",7.4,5.8,3.4,0.8,0.4],
  ["Danny Granger","Miami Heat","MIA","2010s","SF|PF",8.8,3.4,1.6,0.8,0.4],
  ["Rashard Lewis","Miami Heat","MIA","2010s","PF|SF",9.4,4.2,1.8,0.6,0.4],
  ["Hassan Whiteside","Miami Heat","MIA","2010s","C",14.2,11.8,0.6,0.8,3.8],

  ["Andre Roberson","Oklahoma City Thunder","OKC","2010s","SF|SG",5.4,4.2,1.4,1.8,0.4],
  ["Jerami Grant","Oklahoma City Thunder","OKC","2010s","PF|SF",9.2,3.8,1.4,0.8,1.2],
  ["Steven Adams","Oklahoma City Thunder","OKC","2010s","C",13.4,10.2,1.4,0.8,1.2],
  ["Enes Kanter","Oklahoma City Thunder","OKC","2010s","C|PF",14.2,8.4,1.2,0.5,0.8],
  ["Corey Brewer","Oklahoma City Thunder","OKC","2010s","SF|SG",9.8,3.8,2.4,1.6,0.4],
  ["Cameron Payne","Oklahoma City Thunder","OKC","2010s","PG",7.8,2.8,3.4,0.8,0.2],

  ["Thon Maker","Milwaukee Bucks","MIL","2010s","C|PF",6.4,4.4,0.8,0.6,1.4],
  ["Sterling Brown","Milwaukee Bucks","MIL","2010s","SG|SF",6.8,3.4,2.0,1.0,0.3],
  ["Pat Connaughton","Milwaukee Bucks","MIL","2010s","SG|SF",9.3,5.2,2.0,0.7,0.3],
  ["Donte DiVincenzo","Milwaukee Bucks","MIL","2010s","SG|PG",8.8,4.4,2.4,1.2,0.4],
  ["Robin Lopez","Milwaukee Bucks","MIL","2010s","C",7.4,4.4,1.4,0.4,0.8],
  ["D.J. Wilson","Milwaukee Bucks","MIL","2010s","PF|SF",5.4,3.2,1.2,0.4,0.6],

  ["Cory Joseph","San Antonio Spurs","SAS","2010s","PG|SG",7.8,2.4,3.8,0.9,0.2],
  ["Aron Baynes","San Antonio Spurs","SAS","2010s","C|PF",6.4,5.8,0.8,0.5,0.6],
  ["Marco Belinelli","San Antonio Spurs","SAS","2010s","SG|SF",11.2,2.8,2.4,0.8,0.2],
  ["Jonathon Simmons","San Antonio Spurs","SAS","2010s","SG|SF",8.8,3.2,2.4,1.0,0.4],
  ["David West","San Antonio Spurs","SAS","2010s","PF|C",8.4,5.4,2.8,0.8,1.0],
  ["Kyle Anderson","San Antonio Spurs","SAS","2010s","SF|PF",9.4,4.8,3.2,1.0,0.6],
  ["Dejounte Murray","San Antonio Spurs","SAS","2010s","PG",11.4,5.4,5.0,1.8,0.4],
  ["Lonnie Walker IV","San Antonio Spurs","SAS","2010s","SG|SF",9.8,2.8,1.8,0.8,0.3],

  ["Nicolas Batum","Portland Trail Blazers","POR","2010s","SF|SG",14.8,5.8,4.8,1.2,0.6],
  ["Robin Lopez","Portland Trail Blazers","POR","2010s","C",10.2,7.4,0.8,0.4,0.8],
  ["Wesley Matthews","Portland Trail Blazers","POR","2010s","SG|SF",14.8,3.6,2.2,1.2,0.4],
  ["Thomas Robinson","Portland Trail Blazers","POR","2010s","PF|C",8.4,8.2,0.8,0.6,0.8],
  ["Dorell Wright","Portland Trail Blazers","POR","2010s","SF|SG",9.4,3.8,2.2,1.0,0.4],
  ["Gerald Henderson","Portland Trail Blazers","POR","2010s","SG|SF",11.4,3.2,2.4,1.0,0.3],
  ["Noah Vonleh","Portland Trail Blazers","POR","2010s","PF|C",8.4,7.2,1.4,0.6,0.6],
  ["Shabazz Napier","Portland Trail Blazers","POR","2010s","PG",9.4,3.0,4.8,0.8,0.2],
  ["Jake Layman","Portland Trail Blazers","POR","2010s","SF|PF",7.8,3.8,1.4,0.7,0.4],
  ["Zach Collins","Portland Trail Blazers","POR","2010s","C|PF",8.4,5.4,1.8,0.5,1.2],
  ["Gary Trent Jr.","Portland Trail Blazers","POR","2010s","SG|SF",8.2,2.4,1.2,0.8,0.2],

  ["Julian Strawther","Denver Nuggets","DEN","2020s","SG|SF",8.4,3.2,1.4,0.6,0.3],
  ["Hunter Tyson","Denver Nuggets","DEN","2020s","SF|PF",5.8,3.4,1.0,0.5,0.4],
  ["Braxton Key","Denver Nuggets","DEN","2020s","SF|PF",5.2,3.8,1.2,0.8,0.4],

  ["Andre Jackson Jr.","Milwaukee Bucks","MIL","2020s","SG|SF",6.4,3.2,1.8,0.8,0.4],

  ["Seth Curry","Dallas Mavericks","DAL","2020s","PG|SG",10.4,2.4,2.8,0.6,0.2],
  ["JaVale McGee","Dallas Mavericks","DAL","2020s","C",7.4,5.8,0.8,0.4,1.4],

  ["Charles Bassey","Philadelphia 76ers","PHI","2020s","C|PF",8.8,7.2,1.2,0.6,1.4],
  ["Furkan Korkmaz","Philadelphia 76ers","PHI","2020s","SG|SF",9.4,2.8,1.8,0.6,0.2],
  ["Jaden Springer","Philadelphia 76ers","PHI","2020s","SG|PG",6.8,2.4,2.4,0.8,0.3],
  ["Montrezl Harrell","Philadelphia 76ers","PHI","2020s","C|PF",11.4,6.4,1.2,0.6,0.8],
  ["Danuel House Jr.","Philadelphia 76ers","PHI","2020s","SF|SG",7.8,3.4,1.4,0.8,0.3],

  ["Xavier Tillman","Boston Celtics","BOS","2020s","PF|C",6.8,5.4,1.4,0.6,0.6],
  ["Svi Mykhailiuk","Boston Celtics","BOS","2020s","SG|SF",7.2,2.4,1.8,0.6,0.2],
  ["JD Davison","Boston Celtics","BOS","2020s","PG|SG",5.4,2.4,3.2,0.8,0.2],
  ["Lamar Stevens","Boston Celtics","BOS","2020s","SF|PF",5.8,3.2,1.4,0.7,0.3],

  ["Vit Krejci","Oklahoma City Thunder","OKC","2020s","PG|SG",5.8,3.4,3.2,0.8,0.4],
  ["Ousmane Dieng","Oklahoma City Thunder","OKC","2020s","SF|PF",6.4,3.4,1.8,0.6,0.4],
  ["Jeremiah Robinson-Earl","Oklahoma City Thunder","OKC","2020s","PF|C",7.4,5.4,1.2,0.5,0.5],

  ["Jaylen Clark","Minnesota Timberwolves","MIN","2020s","SG|SF",5.8,2.8,1.8,1.2,0.4],
  ["Leonard Miller","Minnesota Timberwolves","MIN","2020s","SF|PF",6.4,4.2,1.4,0.6,0.6],

  ["Neemias Queta","Sacramento Kings","SAC","2020s","C",7.2,5.8,0.8,0.4,1.4],
  ["KZ Okpala","Sacramento Kings","SAC","2020s","SF|PF",5.8,3.4,1.2,0.6,0.4],
  ["Louis King","Sacramento Kings","SAC","2020s","SF|SG",5.4,2.8,1.4,0.6,0.3],

  ["Kendall Brown","Indiana Pacers","IND","2020s","SF|SG",6.4,3.2,1.8,0.8,0.4],
  ["Ben Sheppard","Indiana Pacers","IND","2020s","SG|SF",8.8,3.4,2.4,0.8,0.3],

  ["Romeo Langford","San Antonio Spurs","SAS","2020s","SG|SF",7.8,3.2,2.0,0.9,0.4],
  ["Khem Birch","San Antonio Spurs","SAS","2020s","C|PF",7.4,6.4,1.4,0.6,0.8],
  ["Keita Bates-Diop","San Antonio Spurs","SAS","2020s","SF|PF",8.4,4.2,1.8,0.7,0.4],
  ["Cedi Osman","San Antonio Spurs","SAS","2020s","SF|SG",8.8,3.4,2.4,0.8,0.3],

  ["Thomas Bryant","Los Angeles Lakers","LAL","2020s","C|PF",10.4,7.2,0.8,0.4,1.2],
  ["Max Christie","Los Angeles Lakers","LAL","2020s","SG|SF",7.2,2.8,1.8,0.7,0.3],
  ["Damian Jones","Los Angeles Lakers","LAL","2020s","C",6.4,5.4,0.8,0.4,1.0],
  ["Skylar Mays","Los Angeles Lakers","LAL","2020s","PG|SG",5.8,2.4,2.8,0.8,0.2],

  ["Donte DiVincenzo","Golden State Warriors","GSW","2020s","SG|PG",9.4,4.2,3.4,1.4,0.4],
  ["Ty Jerome","Golden State Warriors","GSW","2020s","PG|SG",8.4,2.8,4.4,0.8,0.2],
  ["Patrick Baldwin Jr.","Golden State Warriors","GSW","2020s","SF|PF",6.4,3.4,1.4,0.6,0.3],
  ["Lester Quinones","Golden State Warriors","GSW","2020s","SG|SF",5.8,2.4,1.8,0.6,0.2],
  ["Ryan Rollins","Golden State Warriors","GSW","2020s","PG|SG",5.4,2.2,2.4,0.7,0.2],
  ["Dominique Wilkins","Atlanta Hawks","ATL","1990s","SF|SG",26.4,6.2,2.6,1.2,0.5],
  ["Mookie Blaylock","Atlanta Hawks","ATL","1990s","PG|SG",15.8,4.2,6.8,2.4,0.3],
  ["Kevin Willis","Atlanta Hawks","ATL","1990s","PF|C",14.8,10.2,1.4,0.8,0.8],
  ["Stacey Augmon","Atlanta Hawks","ATL","1990s","SG|SF",12.4,4.4,3.2,1.8,0.6],
  ["Steve Smith","Atlanta Hawks","ATL","1990s","SG|SF",18.4,3.8,5.4,1.4,0.4],
  ["Dikembe Mutombo","Atlanta Hawks","ATL","1990s","C",11.2,12.4,1.4,0.6,3.6],
  ["Alan Henderson","Atlanta Hawks","ATL","1990s","PF|C",12.8,8.2,1.4,0.8,0.8],
  ["LaPhonso Ellis","Atlanta Hawks","ATL","1990s","PF|C",11.4,7.8,1.8,1.0,0.8],
  ["Craig Ehlo","Atlanta Hawks","ATL","1990s","SG|SF",8.4,3.8,3.2,1.2,0.3],
  ["Eldridge Recasner","Atlanta Hawks","ATL","1990s","PG",8.2,2.4,4.8,1.0,0.1],
  ["Jason Terry","Atlanta Hawks","ATL","2000s","PG|SG",16.8,3.2,5.2,1.2,0.2],
  ["Shareef Abdur-Rahim","Atlanta Hawks","ATL","2000s","PF|SF",18.4,8.2,2.4,1.0,0.6],
  ["Al Horford","Atlanta Hawks","ATL","2000s","C|PF",13.4,9.8,2.0,0.8,1.2],
  ["Josh Smith","Atlanta Hawks","ATL","2000s","PF|SF",14.8,8.4,2.8,1.6,2.4],
  ["Joe Johnson","Atlanta Hawks","ATL","2000s","SG|SF",22.4,4.2,4.8,1.2,0.4],
  ["Mike Bibby","Atlanta Hawks","ATL","2000s","PG",14.8,3.0,5.8,1.0,0.2],
  ["Marvin Williams","Atlanta Hawks","ATL","2000s","PF|SF",11.2,5.4,1.4,0.8,0.6],
  ["Zaza Pachulia","Atlanta Hawks","ATL","2000s","C",9.4,8.4,1.8,0.6,0.6],
  ["Boris Diaw","Atlanta Hawks","ATL","2000s","PF|SF",8.4,5.4,3.8,0.8,0.4],
  ["Lorenzen Wright","Atlanta Hawks","ATL","2000s","C|PF",8.2,7.2,1.2,0.6,0.6],
  ["Paul Millsap","Atlanta Hawks","ATL","2010s","PF|C",17.4,8.2,3.4,1.6,1.2],
  ["Jeff Teague","Atlanta Hawks","ATL","2010s","PG",14.8,3.0,6.8,1.4,0.2],
  ["Kyle Korver","Atlanta Hawks","ATL","2010s","SG|SF",12.4,3.4,2.4,1.0,0.4],
  ["Al Horford","Atlanta Hawks","ATL","2010s","C|PF",17.4,7.8,3.8,1.0,1.4],
  ["DeMarre Carroll","Atlanta Hawks","ATL","2010s","SF|PF",10.4,5.4,2.0,1.4,0.6],
  ["Kent Bazemore","Atlanta Hawks","ATL","2010s","SG|SF",11.8,4.2,2.8,1.6,0.4],
  ["Trae Young","Atlanta Hawks","ATL","2010s","PG",24.8,3.8,9.4,1.0,0.2],
  ["John Collins","Atlanta Hawks","ATL","2010s","PF|C",19.4,9.8,1.8,0.8,1.0],
  ["DeAndre Bembry","Atlanta Hawks","ATL","2010s","SF|SG",8.4,4.2,2.4,1.2,0.4],
  ["Thabo Sefolosha","Atlanta Hawks","ATL","2010s","SF|SG",7.2,4.0,1.8,1.6,0.4],
  ["Trae Young","Atlanta Hawks","ATL","2020s","PG",26.4,3.4,10.8,1.0,0.2],
  ["Dejounte Murray","Atlanta Hawks","ATL","2020s","PG|SG",21.4,5.4,6.4,1.8,0.4],
  ["John Collins","Atlanta Hawks","ATL","2020s","PF|C",15.4,7.8,2.0,0.8,1.2],
  ["Clint Capela","Atlanta Hawks","ATL","2020s","C",12.4,11.8,1.2,0.8,1.8],
  ["Bogdan Bogdanovic","Atlanta Hawks","ATL","2020s","SG|SF",15.2,4.2,3.4,0.8,0.3],
  ["De'Andre Hunter","Atlanta Hawks","ATL","2020s","SF|SG",13.8,4.2,2.4,1.0,0.4],
  ["Onyeka Okongwu","Atlanta Hawks","ATL","2020s","C|PF",11.4,7.8,1.8,0.8,1.2],
  ["Saddiq Bey","Atlanta Hawks","ATL","2020s","SF|SG",14.4,4.8,2.4,0.8,0.4],
  ["Larry Nance Jr.","Atlanta Hawks","ATL","2020s","PF|SF",8.4,6.4,2.4,1.0,1.2],
  ["Vit Krejci","Atlanta Hawks","ATL","2020s","PG|SG",6.8,3.4,3.2,0.8,0.4],
  ["Larry Bird","Boston Celtics","BOS","1990s","SF|PF",19.2,8.2,7.2,1.4,0.6],
  ["Dee Brown","Boston Celtics","BOS","1990s","PG",14.8,3.2,4.8,1.4,0.2],
  ["Reggie Lewis","Boston Celtics","BOS","1990s","SG|SF",20.8,4.4,3.4,1.6,0.6],
  ["Robert Parish","Boston Celtics","BOS","1990s","C",14.4,8.8,1.8,0.8,1.2],
  ["Kevin McHale","Boston Celtics","BOS","1990s","PF|C",16.4,6.8,1.8,0.6,1.6],
  ["Rick Fox","Boston Celtics","BOS","1990s","SF|SG",10.4,4.8,3.4,1.2,0.6],
  ["Sherman Douglas","Boston Celtics","BOS","1990s","PG",13.4,3.2,8.0,1.2,0.2],
  ["Antoine Walker","Boston Celtics","BOS","1990s","PF|SF",17.8,8.4,3.4,1.2,0.6],
  ["Paul Pierce","Boston Celtics","BOS","1990s","SF|PF",19.8,5.4,3.2,1.4,0.6],
  ["Kenny Anderson","Boston Celtics","BOS","1990s","PG",12.4,3.4,7.2,1.4,0.2],
  ["Rajon Rondo","Boston Celtics","BOS","2010s","PG",12.4,5.4,9.8,1.8,0.2],
  ["Paul Pierce","Boston Celtics","BOS","2010s","SF|PF",19.4,5.4,3.8,1.2,0.6],
  ["Kevin Garnett","Boston Celtics","BOS","2010s","PF|C",14.8,8.4,2.8,1.2,1.4],
  ["Avery Bradley","Boston Celtics","BOS","2010s","PG|SG",13.4,3.2,2.4,1.6,0.4],
  ["Jayson Tatum","Boston Celtics","BOS","2010s","SF|PF",18.8,8.1,2.8,1.0,1.0],
  ["Jaylen Brown","Boston Celtics","BOS","2010s","SG|SF",16.8,4.8,2.4,1.2,0.4],
  ["Isaiah Thomas","Boston Celtics","BOS","2010s","PG",24.8,2.8,5.8,0.8,0.2],
  ["Al Horford","Boston Celtics","BOS","2010s","C|PF",13.8,6.8,4.8,1.0,1.2],
  ["Marcus Smart","Boston Celtics","BOS","2010s","PG|SG",10.4,3.4,5.4,1.8,0.4],
  ["Gordon Hayward","Boston Celtics","BOS","2010s","SF|SG",14.8,5.4,3.4,0.8,0.4],
  ["Julius Erving","Brooklyn Nets","BKN","1970s","SF|PF",28.4,10.8,4.8,2.2,1.8],
  ["Brian Taylor","Brooklyn Nets","BKN","1970s","PG|SG",16.4,3.8,5.2,3.2,0.3],
  ["John Williamson","Brooklyn Nets","BKN","1970s","SG|PG",19.4,3.2,3.8,1.4,0.2],
  ["Larry Kenon","Brooklyn Nets","BKN","1970s","PF|SF",14.4,9.4,2.8,1.8,0.6],
  ["Bill Melchionni","Brooklyn Nets","BKN","1970s","PG",14.4,3.4,6.8,1.4,0.2],
  ["Tim Bassett","Brooklyn Nets","BKN","1970s","PF|C",9.4,9.4,1.8,0.9,0.8],
  ["Wendell Ladner","Brooklyn Nets","BKN","1970s","SF|PF",10.4,8.4,2.4,1.2,0.6],
  ["Rich Jones","Brooklyn Nets","BKN","1970s","SF|PF",10.4,5.4,2.4,1.2,0.4],
  ["Jim Eakins","Brooklyn Nets","BKN","1970s","C",10.4,9.4,2.4,0.8,1.2],
  ["Ollie Taylor","Brooklyn Nets","BKN","1970s","SG|SF",13.4,4.4,2.8,1.6,0.3],
  ["Buck Williams","Brooklyn Nets","BKN","1980s","PF|C",16.8,12.4,1.8,1.0,1.1],
  ["Micheal Ray Richardson","Brooklyn Nets","BKN","1980s","PG|SG",18.4,5.4,7.8,3.2,0.6],
  ["Otis Birdsong","Brooklyn Nets","BKN","1980s","SG|PF",20.4,3.4,3.4,1.4,0.2],
  ["Bernard King","Brooklyn Nets","BKN","1980s","SF|SG",24.8,5.8,3.4,1.4,0.4],
  ["Darwin Cook","Brooklyn Nets","BKN","1980s","SG|PG",11.4,3.2,4.8,2.2,0.3],
  ["Mike Gminski","Brooklyn Nets","BKN","1980s","C",14.4,8.8,1.4,0.6,1.4],
  ["Darryl Dawkins","Brooklyn Nets","BKN","1980s","C",12.4,7.4,1.4,0.6,1.2],
  ["Ray Williams","Brooklyn Nets","BKN","1980s","PG|SG",14.4,3.8,5.4,1.6,0.3],
  ["Albert King","Brooklyn Nets","BKN","1980s","SF|SG",13.4,4.8,2.4,0.8,0.4],
  ["Mike O'Koren","Brooklyn Nets","BKN","1980s","SF|SG",9.4,4.4,2.8,1.2,0.4],
  ["Kenny Anderson","Brooklyn Nets","BKN","1990s","PG",16.8,3.8,8.8,1.8,0.2],
  ["Derrick Coleman","Brooklyn Nets","BKN","1990s","PF|C",19.8,10.4,3.4,1.2,1.2],
  ["Drazen Petrovic","Brooklyn Nets","BKN","1990s","SG",22.4,3.4,3.4,1.0,0.2],
  ["Kerry Kittles","Brooklyn Nets","BKN","1990s","SG|SF",16.4,4.2,2.8,1.8,0.4],
  ["Jayson Williams","Brooklyn Nets","BKN","1990s","PF|C",10.4,12.4,1.4,0.8,0.6],
  ["Keith Van Horn","Brooklyn Nets","BKN","1990s","PF|SF",17.4,7.4,2.4,0.8,0.6],
  ["Sam Cassell","Brooklyn Nets","BKN","1990s","PG",18.4,3.4,7.4,1.4,0.2],
  ["Armon Gilliam","Brooklyn Nets","BKN","1990s","PF|C",14.4,7.8,1.8,0.8,0.6],
  ["Kevin Edwards","Brooklyn Nets","BKN","1990s","SG|SF",11.4,3.4,2.8,1.4,0.3],
  ["Chris Gatling","Brooklyn Nets","BKN","1990s","PF|C",13.4,8.4,1.4,0.8,0.8],
  ["Jason Kidd","Brooklyn Nets","BKN","2000s","PG",18.7,7.3,8.9,2.2,0.4],
  ["Richard Jefferson","Brooklyn Nets","BKN","2000s","SF|SG",18.4,5.4,3.4,1.0,0.6],
  ["Kenyon Martin","Brooklyn Nets","BKN","2000s","PF|C",14.4,7.8,2.4,1.2,1.0],
  ["Vince Carter","Brooklyn Nets","BKN","2000s","SG|SF",24.4,4.8,3.8,1.4,0.4],
  ["Nenad Krstic","Brooklyn Nets","BKN","2000s","C",13.4,6.4,1.8,0.6,1.2],
  ["Brook Lopez","Brooklyn Nets","BKN","2000s","C",18.4,8.4,1.4,0.6,1.8],
  ["Devin Harris","Brooklyn Nets","BKN","2000s","PG",18.4,3.4,6.4,1.8,0.2],
  ["Marcus Williams","Brooklyn Nets","BKN","2000s","PG",10.4,3.4,6.4,1.2,0.2],
  ["Josh Boone","Brooklyn Nets","BKN","2000s","C|PF",7.4,6.8,0.8,0.6,0.8],
  ["Trenton Hassell","Brooklyn Nets","BKN","2000s","SG|SF",7.8,3.4,2.4,1.4,0.3],
  ["Brook Lopez","Brooklyn Nets","BKN","2010s","C",16.4,7.4,2.4,0.6,1.8],
  ["Kevin Durant","Brooklyn Nets","BKN","2010s","SF|PF",28.4,7.4,5.4,1.2,1.2],
  ["Kyrie Irving","Brooklyn Nets","BKN","2010s","PG|SG",26.4,4.4,5.8,1.4,0.4],
  ["James Harden","Brooklyn Nets","BKN","2010s","SG|PG",22.4,8.4,10.4,1.4,0.6],
  ["Joe Harris","Brooklyn Nets","BKN","2010s","SG|SF",14.4,4.4,2.4,0.8,0.4],
  ["Caris LeVert","Brooklyn Nets","BKN","2010s","SG|SF",18.4,4.4,4.4,1.4,0.4],
  ["D'Angelo Russell","Brooklyn Nets","BKN","2010s","PG|SG",21.4,3.4,5.4,1.2,0.2],
  ["Jarrett Allen","Brooklyn Nets","BKN","2010s","C",11.4,9.4,1.4,0.6,1.4],
  ["Spencer Dinwiddie","Brooklyn Nets","BKN","2010s","PG|SG",20.4,3.4,6.4,0.8,0.3],
  ["DeAndre Jordan","Brooklyn Nets","BKN","2010s","C",8.4,11.4,1.4,0.4,1.2],
  ["Kevin Durant","Brooklyn Nets","BKN","2020s","SF|PF",29.4,7.4,5.4,0.8,1.2],
  ["Kyrie Irving","Brooklyn Nets","BKN","2020s","PG|SG",25.4,4.4,5.4,1.4,0.4],
  ["Mikal Bridges","Brooklyn Nets","BKN","2020s","SF|SG",26.4,4.4,3.4,1.2,0.4],
  ["Cam Thomas","Brooklyn Nets","BKN","2020s","SG|PG",22.4,3.4,3.4,1.0,0.3],
  ["Nic Claxton","Brooklyn Nets","BKN","2020s","C",14.4,9.4,2.4,1.2,2.4],
  ["Ben Simmons","Brooklyn Nets","BKN","2020s","PG|SF",8.4,6.4,5.4,1.4,0.6],
  ["Day'Ron Sharpe","Brooklyn Nets","BKN","2020s","C|PF",8.4,7.4,1.4,0.8,0.8],
  ["Royce O'Neale","Brooklyn Nets","BKN","2020s","SF|PF",9.4,4.4,2.8,1.4,0.4],
  ["Dennis Schroder","Brooklyn Nets","BKN","2020s","PG|SG",15.4,3.4,5.4,1.2,0.2],
  ["Seth Curry","Brooklyn Nets","BKN","2020s","PG|SG",11.4,2.4,2.8,0.6,0.2],
  ["Rex Chapman","Charlotte Hornets","CHA","1990s","SG|PG",16.8,3.2,3.4,1.4,0.3],
  ["Larry Johnson","Charlotte Hornets","CHA","1990s","PF|SF",20.4,9.4,3.8,1.2,0.6],
  ["Alonzo Mourning","Charlotte Hornets","CHA","1990s","C",21.4,10.4,1.8,1.0,3.2],
  ["Muggsy Bogues","Charlotte Hornets","CHA","1990s","PG",8.4,3.4,8.8,2.4,0.2],
  ["Dell Curry","Charlotte Hornets","CHA","1990s","SG|PG",16.4,2.8,2.4,1.0,0.2],
  ["Glen Rice","Charlotte Hornets","CHA","1990s","SG|SF",22.4,4.8,2.8,1.0,0.4],
  ["Vlade Divac","Charlotte Hornets","CHA","1990s","C",11.4,8.8,3.4,1.2,1.4],
  ["Baron Davis","Charlotte Hornets","CHA","1990s","PG",17.4,4.4,7.4,2.4,0.4],
  ["David Wesley","Charlotte Hornets","CHA","1990s","PG|SG",12.4,3.4,5.4,1.4,0.2],
  ["Matt Geiger","Charlotte Hornets","CHA","1990s","C|PF",10.4,7.8,1.4,0.6,0.8],
  ["Baron Davis","Charlotte Hornets","CHA","2000s","PG",18.8,4.2,7.8,2.2,0.4],
  ["Emeka Okafor","Charlotte Hornets","CHA","2000s","C|PF",12.4,11.4,1.4,0.8,2.2],
  ["Gerald Wallace","Charlotte Hornets","CHA","2000s","SF|SG",16.4,8.4,2.8,2.2,1.4],
  ["Raymond Felton","Charlotte Hornets","CHA","2000s","PG",12.4,3.4,6.4,1.2,0.2],
  ["Stephen Jackson","Charlotte Hornets","CHA","2000s","SG|SF",18.4,5.4,3.4,1.4,0.4],
  ["Primoz Brezec","Charlotte Hornets","CHA","2000s","C",12.4,7.4,1.4,0.6,1.2],
  ["Brevin Knight","Charlotte Hornets","CHA","2000s","PG",7.4,3.4,7.4,1.6,0.2],
  ["Adam Morrison","Charlotte Hornets","CHA","2000s","SF|SG",8.4,3.4,1.8,0.6,0.3],
  ["Matt Carroll","Charlotte Hornets","CHA","2000s","SG|SF",9.4,3.4,1.8,0.8,0.3],
  ["Melvin Ely","Charlotte Hornets","CHA","2000s","C|PF",6.8,5.4,0.8,0.5,0.8],
  ["Kemba Walker","Charlotte Hornets","CHA","2010s","PG",21.4,3.8,5.8,1.2,0.2],
  ["Nicolas Batum","Charlotte Hornets","CHA","2010s","SF|SG",14.4,5.8,5.4,1.4,0.6],
  ["Al Jefferson","Charlotte Hornets","CHA","2010s","C|PF",18.4,9.4,1.4,0.6,1.4],
  ["Dwight Howard","Charlotte Hornets","CHA","2010s","C",14.4,12.4,1.8,0.8,1.8],
  ["Jeremy Lamb","Charlotte Hornets","CHA","2010s","SG|SF",14.4,4.8,2.4,1.0,1.2],
  ["Michael Kidd-Gilchrist","Charlotte Hornets","CHA","2010s","SF|SG",10.4,5.4,1.8,1.4,0.6],
  ["Marvin Williams","Charlotte Hornets","CHA","2010s","PF|SF",12.4,6.4,1.8,0.8,0.6],
  ["Cody Zeller","Charlotte Hornets","CHA","2010s","C|PF",10.4,7.4,2.4,0.8,0.8],
  ["Tony Parker","Charlotte Hornets","CHA","2010s","PG",9.4,2.8,4.8,0.8,0.2],
  ["Frank Kaminsky","Charlotte Hornets","CHA","2010s","C|PF",9.4,4.4,2.4,0.6,0.6],
  ["LaMelo Ball","Charlotte Hornets","CHA","2020s","PG",21.4,7.4,7.8,1.6,0.4],
  ["Miles Bridges","Charlotte Hornets","CHA","2020s","SF|PF",20.2,7.0,3.8,1.2,0.8],
  ["Terry Rozier","Charlotte Hornets","CHA","2020s","PG|SG",21.4,4.4,4.8,1.4,0.3],
  ["Gordon Hayward","Charlotte Hornets","CHA","2020s","SF|SG",13.4,5.4,4.4,1.0,0.4],
  ["P.J. Washington","Charlotte Hornets","CHA","2020s","PF|SF",14.4,6.4,2.8,1.0,0.8],
  ["Mason Plumlee","Charlotte Hornets","CHA","2020s","C",7.4,7.4,3.4,0.6,0.8],
  ["Nick Richards","Charlotte Hornets","CHA","2020s","C",8.4,7.4,0.8,0.6,1.4],
  ["Cody Martin","Charlotte Hornets","CHA","2020s","SF|SG",8.4,4.4,2.8,1.4,0.4],
  ["Kelly Oubre Jr.","Charlotte Hornets","CHA","2020s","SF|SG",20.4,5.4,2.4,1.2,0.4],
  ["Dennis Smith Jr.","Charlotte Hornets","CHA","2020s","PG",9.4,3.4,4.4,1.0,0.3],
  ["Jerry Sloan","Chicago Bulls","CHI","1970s","SG|SF",16.4,6.4,3.4,2.2,0.6],
  ["Bob Love","Chicago Bulls","CHI","1970s","SF|SG",22.4,6.4,2.4,1.2,0.4],
  ["Chet Walker","Chicago Bulls","CHI","1970s","SF|SG",18.4,6.4,2.8,1.2,0.4],
  ["Norm Van Lier","Chicago Bulls","CHI","1970s","PG",12.4,4.4,7.4,2.8,0.4],
  ["Tom Boerwinkle","Chicago Bulls","CHI","1970s","C",9.4,12.4,5.4,0.8,0.8],
  ["Artis Gilmore","Chicago Bulls","CHI","1970s","C",19.4,15.4,2.4,1.0,3.4],
  ["Reggie Theus","Chicago Bulls","CHI","1970s","PG|SG",16.4,3.8,5.8,1.2,0.3],
  ["Scott May","Chicago Bulls","CHI","1970s","SF|SG",11.4,4.4,2.4,1.2,0.4],
  ["Mickey Johnson","Chicago Bulls","CHI","1970s","PF|SF",14.4,6.4,3.4,1.4,0.8],
  ["Bob Weiss","Chicago Bulls","CHI","1970s","PG|SG",9.4,2.8,4.8,1.4,0.2],
  ["Elton Brand","Chicago Bulls","CHI","2000s","PF|C",18.4,9.4,2.4,1.2,1.8],
  ["Derrick Rose","Chicago Bulls","CHI","2000s","PG",17.4,3.8,6.4,1.0,0.4],
  ["Luol Deng","Chicago Bulls","CHI","2000s","SF|SG",14.8,5.8,2.4,1.2,0.6],
  ["Ben Gordon","Chicago Bulls","CHI","2000s","SG|PG",17.4,2.8,3.4,1.0,0.2],
  ["Kirk Hinrich","Chicago Bulls","CHI","2000s","PG|SG",13.4,3.4,5.4,1.4,0.4],

  ["Andres Nocioni","Chicago Bulls","CHI","2000s","SF|PF",11.4,5.4,2.4,1.0,0.6],
  ["Chris Duhon","Chicago Bulls","CHI","2000s","PG",7.4,2.8,5.4,1.2,0.2],
  ["Tyson Chandler","Chicago Bulls","CHI","2000s","C",8.4,10.4,1.4,0.8,1.4],
  ["Joakim Noah","Chicago Bulls","CHI","2000s","C",7.8,8.4,2.4,0.8,1.6],
  ["Derrick Rose","Chicago Bulls","CHI","2010s","PG",20.4,3.8,7.8,1.0,0.6],
  ["Joakim Noah","Chicago Bulls","CHI","2010s","C",11.4,11.4,5.4,0.8,1.4],
  ["Jimmy Butler","Chicago Bulls","CHI","2010s","SG|SF",18.4,5.4,3.4,1.8,0.4],
  ["Carlos Boozer","Chicago Bulls","CHI","2010s","PF|C",16.4,9.4,2.8,0.8,0.6],
  ["Nikola Mirotic","Chicago Bulls","CHI","2010s","PF|SF",13.4,5.4,2.4,0.8,0.6],
  ["Taj Gibson","Chicago Bulls","CHI","2010s","PF|C",12.4,7.4,1.4,0.8,1.2],
  ["Luol Deng","Chicago Bulls","CHI","2010s","SF|SG",17.4,6.8,3.4,1.4,0.6],
  ["Zach LaVine","Chicago Bulls","CHI","2010s","SG|PG",18.4,4.4,3.8,1.2,0.4],
  ["Kirk Hinrich","Chicago Bulls","CHI","2010s","PG|SG",9.4,2.8,4.4,1.4,0.3],
  ["Dwyane Wade","Chicago Bulls","CHI","2010s","PG|SG",18.4,3.8,3.8,1.4,0.6],
  ["Zach LaVine","Chicago Bulls","CHI","2020s","SG|PG",24.4,4.8,4.4,1.2,0.4],
  ["DeMar DeRozan","Chicago Bulls","CHI","2020s","SF|SG",22.4,5.2,4.8,0.8,0.4],
  ["Nikola Vucevic","Chicago Bulls","CHI","2020s","C|PF",17.4,11.4,3.4,0.8,1.0],
  ["Lonzo Ball","Chicago Bulls","CHI","2020s","PG",13.4,5.4,5.4,1.8,0.4],
  ["Patrick Williams","Chicago Bulls","CHI","2020s","SF|PF",10.4,5.4,2.4,0.8,0.6],
  ["Alex Caruso","Chicago Bulls","CHI","2020s","PG|SG",9.4,3.4,4.4,2.2,0.4],
  ["Coby White","Chicago Bulls","CHI","2020s","PG|SG",19.4,4.4,4.4,0.8,0.2],
  ["Ayo Dosunmu","Chicago Bulls","CHI","2020s","PG|SG",12.4,3.4,4.4,1.2,0.3],
  ["Andre Drummond","Chicago Bulls","CHI","2020s","C",10.4,11.4,1.4,0.8,1.0],
  ["Torrey Craig","Chicago Bulls","CHI","2020s","SF|PF",7.4,4.4,1.8,1.0,0.4],
  ["Austin Carr","Cleveland Cavaliers","CLE","1970s","SG|PG",19.4,3.4,4.4,1.2,0.2],
  ["Bingo Smith","Cleveland Cavaliers","CLE","1970s","SG|SF",16.4,5.4,2.8,1.2,0.4],
  ["Jim Cleamons","Cleveland Cavaliers","CLE","1970s","PG|SG",10.4,4.4,5.4,1.6,0.3],
  ["Nate Thurmond","Cleveland Cavaliers","CLE","1970s","C|PF",14.4,12.4,2.8,1.0,2.4],
  ["Jim Chones","Cleveland Cavaliers","CLE","1970s","C|PF",14.4,9.4,2.4,0.8,1.4],
  ["Campy Russell","Cleveland Cavaliers","CLE","1970s","SF|SG",18.4,5.4,3.4,1.2,0.4],
  ["Foots Walker","Cleveland Cavaliers","CLE","1970s","PG",10.4,3.4,6.8,1.8,0.2],
  ["Walt Frazier","Cleveland Cavaliers","CLE","1970s","PG|SG",14.4,4.4,5.4,1.6,0.2],
  ["Bobby Smith","Cleveland Cavaliers","CLE","1970s","SF|SG",13.4,5.4,2.4,1.2,0.4],
  ["Dick Snyder","Cleveland Cavaliers","CLE","1970s","SG|PG",12.4,3.4,3.4,1.2,0.2],
  ["World B. Free","Cleveland Cavaliers","CLE","1980s","SG|PG",23.4,3.4,4.4,1.4,0.2],
  ["Ron Harper","Cleveland Cavaliers","CLE","1980s","SG|PG",22.4,5.4,5.4,2.4,0.8],
  ["Brad Daugherty","Cleveland Cavaliers","CLE","1980s","C",19.4,9.4,3.4,0.8,1.0],
  ["Mark Price","Cleveland Cavaliers","CLE","1980s","PG",17.4,2.8,8.8,1.8,0.2],
  ["Hot Rod Williams","Cleveland Cavaliers","CLE","1980s","PF|C",12.4,7.4,2.4,1.0,2.0],
  ["Larry Nance","Cleveland Cavaliers","CLE","1980s","PF|SF",16.4,7.8,2.4,1.2,2.4],
  ["John Bagley","Cleveland Cavaliers","CLE","1980s","PG",11.4,3.8,7.4,1.4,0.2],
  ["Craig Ehlo","Cleveland Cavaliers","CLE","1980s","SG|SF",10.4,4.4,3.4,1.6,0.4],
  ["Phil Hubbard","Cleveland Cavaliers","CLE","1980s","SF|PF",10.4,6.4,2.4,1.0,0.6],
  ["Dell Curry","Cleveland Cavaliers","CLE","1980s","SG|PG",11.4,2.8,2.4,0.8,0.2],
  ["Mark Price","Cleveland Cavaliers","CLE","1990s","PG",18.4,2.8,8.4,1.8,0.2],
  ["Brad Daugherty","Cleveland Cavaliers","CLE","1990s","C",18.4,9.4,3.4,0.6,0.8],
  ["Larry Nance","Cleveland Cavaliers","CLE","1990s","PF|SF",14.4,7.8,2.4,1.2,2.2],
  ["Terrell Brandon","Cleveland Cavaliers","CLE","1990s","PG",17.4,3.4,6.4,2.2,0.2],
  ["Tyrone Hill","Cleveland Cavaliers","CLE","1990s","PF|C",11.4,10.4,1.4,0.8,0.8],
  ["Bobby Phills","Cleveland Cavaliers","CLE","1990s","SG|SF",12.4,4.4,3.4,1.8,0.4],
  ["Shawn Kemp","Cleveland Cavaliers","CLE","1990s","PF|C",18.4,9.4,2.4,1.0,1.4],
  ["Brevin Knight","Cleveland Cavaliers","CLE","1990s","PG",8.4,3.4,7.4,2.0,0.2],
  ["Craig Ehlo","Cleveland Cavaliers","CLE","1990s","SG|SF",10.4,4.4,3.4,1.6,0.4],
  ["Danny Ferry","Cleveland Cavaliers","CLE","1990s","PF|SF",8.4,4.4,2.4,0.8,0.4],
  ["Darius Garland","Cleveland Cavaliers","CLE","2020s","PG",21.4,3.4,7.4,1.2,0.2],
  ["Evan Mobley","Cleveland Cavaliers","CLE","2020s","C|PF",16.4,9.4,3.4,1.4,1.8],
  ["Donovan Mitchell","Cleveland Cavaliers","CLE","2020s","SG|PG",28.4,4.4,4.4,1.4,0.4],
  ["Jarrett Allen","Cleveland Cavaliers","CLE","2020s","C",16.4,10.4,1.8,0.8,1.4],
  ["Caris LeVert","Cleveland Cavaliers","CLE","2020s","SG|SF",14.4,4.4,4.4,1.4,0.4],
  ["Isaac Okoro","Cleveland Cavaliers","CLE","2020s","SG|SF",9.4,3.4,2.4,1.4,0.4],
  ["Dean Wade","Cleveland Cavaliers","CLE","2020s","PF|SF",8.4,4.4,1.8,0.8,0.6],
  ["Kevin Love","Cleveland Cavaliers","CLE","2020s","PF|C",13.4,7.4,2.4,0.6,0.4],
  ["Max Strus","Cleveland Cavaliers","CLE","2020s","SG|SF",12.4,4.4,2.4,0.8,0.3],
  ["Mark Aguirre","Dallas Mavericks","DAL","1980s","SF|PF",24.4,5.4,3.4,1.0,0.6],
  ["Rolando Blackman","Dallas Mavericks","DAL","1980s","SG|SF",20.4,3.4,3.4,1.2,0.4],
  ["Derek Harper","Dallas Mavericks","DAL","1980s","PG|SG",15.4,3.4,6.4,2.2,0.4],
  ["James Donaldson","Dallas Mavericks","DAL","1980s","C",9.4,10.4,1.4,0.6,1.4],
  ["Sam Perkins","Dallas Mavericks","DAL","1980s","PF|C",14.4,7.4,2.4,1.0,1.4],
  ["Roy Tarpley","Dallas Mavericks","DAL","1980s","PF|C",13.4,11.4,2.4,0.8,1.4],
  ["Brad Davis","Dallas Mavericks","DAL","1980s","PG",9.4,2.8,6.4,1.6,0.2],
  ["Dale Ellis","Dallas Mavericks","DAL","1980s","SG|SF",16.4,3.4,2.4,1.0,0.3],
  ["Detlef Schrempf","Dallas Mavericks","DAL","1980s","PF|SF",10.4,5.8,2.8,0.8,0.4],
  ["Bill Wennington","Dallas Mavericks","DAL","1980s","C",8.4,5.4,1.4,0.4,0.8],
  ["Derek Harper","Dallas Mavericks","DAL","1990s","PG|SG",15.4,3.4,6.8,2.0,0.4],
  ["Jamal Mashburn","Dallas Mavericks","DAL","1990s","SF|PF",20.4,5.4,3.4,1.2,0.6],
  ["Jim Jackson","Dallas Mavericks","DAL","1990s","SG|SF",19.4,5.4,3.4,1.2,0.4],
  ["Popeye Jones","Dallas Mavericks","DAL","1990s","PF|C",7.4,9.4,2.4,0.8,0.6],
  ["A.C. Green","Dallas Mavericks","DAL","1990s","PF|SF",7.4,7.4,1.4,0.8,0.4],
  ["Shawn Bradley","Dallas Mavericks","DAL","1990s","C",9.4,7.4,1.4,0.4,3.4],
  ["Cedric Ceballos","Dallas Mavericks","DAL","1990s","SF|PF",12.4,5.4,1.8,0.8,0.4],
  ["Samaki Walker","Dallas Mavericks","DAL","1990s","C|PF",8.4,7.4,1.4,0.6,1.2],
  ["Hubert Davis","Dallas Mavericks","DAL","1990s","SG|PG",10.4,2.4,2.8,0.8,0.2],
  ["Gary Trent","Dallas Mavericks","DAL","1990s","PF|SF",11.4,5.4,1.4,0.8,0.4],
  ["Alex English","Denver Nuggets","DEN","1980s","SF|SG",25.4,5.4,3.4,1.2,0.6],
  ["Kiki Vandeweghe","Denver Nuggets","DEN","1980s","SF|PF",22.4,5.4,2.4,0.8,0.4],
    ["Blair Rasmussen","Denver Nuggets","DEN","1980s","C",10.4,7.4,1.4,0.6,1.4],
  ["Bill Hanzlik","Denver Nuggets","DEN","1980s","SG|SF",9.4,3.4,4.4,1.6,0.4],
  ["Wayne Cooper","Denver Nuggets","DEN","1980s","C|PF",8.4,8.4,1.4,0.8,2.2],
  ["Mike Evans","Denver Nuggets","DEN","1980s","PG|SG",12.4,2.8,5.4,1.4,0.2],
  ["T.R. Dunn","Denver Nuggets","DEN","1980s","SG|SF",5.8,4.4,2.4,1.8,0.4],
  ["Jay Vincent","Denver Nuggets","DEN","1980s","SF|PF",14.4,5.4,2.4,1.0,0.4],
  ["Mike Higgins","Denver Nuggets","DEN","1980s","PG",7.4,2.4,4.4,1.2,0.2],
  ["Dikembe Mutombo","Denver Nuggets","DEN","1990s","C",10.4,12.4,1.4,0.6,3.8],
  ["LaPhonso Ellis","Denver Nuggets","DEN","1990s","PF|C",14.4,8.4,2.4,1.2,1.2],
  ["Antonio McDyess","Denver Nuggets","DEN","1990s","PF|C",16.4,9.4,1.8,1.2,1.4],
  ["Nick Van Exel","Denver Nuggets","DEN","1990s","PG",17.4,3.4,7.4,0.8,0.2],
  ["Mark Jackson","Denver Nuggets","DEN","1990s","PG",11.4,4.4,9.4,1.4,0.2],
  ["Bryant Stith","Denver Nuggets","DEN","1990s","SG|SF",14.4,4.4,3.4,1.4,0.4],
  ["Dale Ellis","Denver Nuggets","DEN","1990s","SG|SF",13.4,3.4,2.4,0.8,0.3],
  ["Danny Fortson","Denver Nuggets","DEN","1990s","PF|C",10.4,10.4,1.4,0.8,0.8],
  ["Reggie Williams","Denver Nuggets","DEN","1990s","SF|SG",17.4,5.4,3.4,1.4,0.4],
  ["Eric Williams","Denver Nuggets","DEN","1990s","SF|SG",10.4,4.4,2.4,1.2,0.4],
  ["Danilo Gallinari","Denver Nuggets","DEN","2010s","SF|PF",18.4,5.4,2.4,0.8,0.4],
  ["Kenneth Faried","Denver Nuggets","DEN","2010s","PF|C",13.4,9.4,1.4,0.8,1.0],
  ["Ty Lawson","Denver Nuggets","DEN","2010s","PG",16.4,3.4,8.4,1.4,0.2],
  ["Nikola Jokic","Denver Nuggets","DEN","2010s","C|PF",21.4,10.6,6.4,1.2,0.9],
  ["Gary Harris","Denver Nuggets","DEN","2010s","SG|PG",14.4,3.4,3.4,1.8,0.4],
  ["Will Barton","Denver Nuggets","DEN","2010s","SG|SF",14.4,4.4,3.4,1.0,0.4],
  ["Paul Millsap","Denver Nuggets","DEN","2010s","PF|C",16.4,7.4,3.4,1.4,1.2],
  ["Jamal Murray","Denver Nuggets","DEN","2010s","PG|SG",18.4,3.4,4.4,1.2,0.3],
  ["Wilson Chandler","Denver Nuggets","DEN","2010s","SF|SG",14.4,5.4,2.4,1.0,0.4],
  ["Mason Plumlee","Denver Nuggets","DEN","2010s","C|PF",8.4,7.4,3.4,0.8,0.8],
  ["Grant Hill","Detroit Pistons","DET","1990s","SF|SG",21.6,7.9,6.3,1.8,0.7],
  ["Joe Dumars","Detroit Pistons","DET","1990s","SG|PG",16.4,2.8,4.4,1.2,0.2],
  ["Allan Houston","Detroit Pistons","DET","1990s","SG",18.4,3.4,3.4,1.0,0.2],
  ["Lindsey Hunter","Detroit Pistons","DET","1990s","PG|SG",12.4,2.8,4.8,1.8,0.3],
  ["Terry Mills","Detroit Pistons","DET","1990s","PF|C",14.4,6.4,2.4,0.8,0.6],
  ["Otis Thorpe","Detroit Pistons","DET","1990s","PF|C",13.4,8.4,2.4,0.8,0.6],
  ["Jerome Williams","Detroit Pistons","DET","1990s","PF|SF",7.4,7.4,1.8,1.0,0.6],
  ["Brian Williams","Detroit Pistons","DET","1990s","C|PF",11.4,7.4,1.4,0.8,1.4],
  ["Don Reid","Detroit Pistons","DET","1990s","C|PF",5.4,5.4,0.8,0.6,0.8],
  ["Mark Macon","Detroit Pistons","DET","1990s","SG|PG",9.4,3.4,3.4,1.4,0.3],
  ["Andre Drummond","Detroit Pistons","DET","2010s","C",14.4,15.4,1.8,1.4,1.6],
  ["Greg Monroe","Detroit Pistons","DET","2010s","C|PF",15.4,9.4,3.4,0.8,0.6],
  ["Brandon Jennings","Detroit Pistons","DET","2010s","PG",17.4,3.4,6.4,1.4,0.3],
  ["Josh Smith","Detroit Pistons","DET","2010s","PF|SF",13.4,6.4,3.4,1.6,2.0],
  ["Rodney Stuckey","Detroit Pistons","DET","2010s","PG|SG",14.4,3.4,4.4,1.0,0.2],
  ["Reggie Jackson","Detroit Pistons","DET","2010s","PG|SG",16.4,3.4,5.4,1.2,0.3],
  ["Tobias Harris","Detroit Pistons","DET","2010s","SF|PF",18.4,7.4,3.4,0.8,0.4],
  ["Blake Griffin","Detroit Pistons","DET","2010s","PF|C",20.4,7.4,4.4,0.8,0.8],
  ["Luke Kennard","Detroit Pistons","DET","2010s","SG|SF",13.4,3.4,2.4,0.8,0.2],
  ["Ish Smith","Detroit Pistons","DET","2010s","PG",11.4,3.4,6.4,1.2,0.2],
  ["Cade Cunningham","Detroit Pistons","DET","2020s","PG|SG",22.4,4.4,7.4,1.4,0.4],
  ["Isaiah Stewart","Detroit Pistons","DET","2020s","C|PF",14.4,8.4,3.4,1.2,1.4],
  ["Jaden Ivey","Detroit Pistons","DET","2020s","PG|SG",14.4,4.4,5.4,1.4,0.4],
  ["Ausar Thompson","Detroit Pistons","DET","2020s","SF|SG",12.4,5.4,2.4,1.8,0.8],
  ["Bojan Bogdanovic","Detroit Pistons","DET","2020s","SF|SG",15.4,3.4,2.4,0.8,0.3],
  ["Marvin Bagley III","Detroit Pistons","DET","2020s","PF|C",14.4,7.4,1.4,0.6,0.6],
  ["James Wiseman","Detroit Pistons","DET","2020s","C",9.4,6.4,1.4,0.6,1.0],
  ["Monte Morris","Detroit Pistons","DET","2020s","PG",9.4,2.4,5.4,0.8,0.2],
  ["Killian Hayes","Detroit Pistons","DET","2020s","PG|SG",8.4,3.4,4.4,1.0,0.4],
  ["Joe Harris","Detroit Pistons","DET","2020s","SG|SF",11.4,3.4,2.4,0.8,0.3],
  ["Purvis Short","Golden State Warriors","GSW","1980s","SF|SG",20.4,4.4,2.8,1.0,0.4],
  ["Joe Barry Carroll","Golden State Warriors","GSW","1980s","C",20.4,9.4,2.4,0.8,2.4],
  ["Chris Mullin","Golden State Warriors","GSW","1980s","SF|SG",22.4,4.4,4.4,1.6,0.4],
  ["Mitch Richmond","Golden State Warriors","GSW","1980s","SG",22.4,4.4,3.4,1.4,0.3],
  ["Sleepy Floyd","Golden State Warriors","GSW","1980s","PG|SG",14.4,3.4,6.4,1.6,0.3],
  ["Winston Garland","Golden State Warriors","GSW","1980s","PG",12.4,4.4,7.4,2.0,0.3],
  ["Rod Higgins","Golden State Warriors","GSW","1980s","SF|PF",10.4,4.8,2.0,1.0,0.4],
  ["Larry Smith","Golden State Warriors","GSW","1980s","PF|C",7.4,9.4,1.4,1.0,0.8],
  ["Terry Teagle","Golden State Warriors","GSW","1980s","SG|SF",13.4,3.4,2.4,1.0,0.3],
  ["Mickey Johnson","Golden State Warriors","GSW","1980s","PF|SF",12.4,5.4,3.4,1.2,0.8],
  ["Chris Mullin","Golden State Warriors","GSW","1990s","SF|SG",24.4,5.4,4.4,1.8,0.6],
  ["Latrell Sprewell","Golden State Warriors","GSW","1990s","SG|SF",20.4,4.4,4.4,2.2,0.6],
  ["Tim Hardaway","Golden State Warriors","GSW","1990s","PG",22.4,3.4,9.4,2.4,0.3],
  ["Mitch Richmond","Golden State Warriors","GSW","1990s","SG",23.4,4.4,3.4,1.4,0.3],
  ["Joe Smith","Golden State Warriors","GSW","1990s","PF|C",15.4,8.4,1.8,0.8,1.0],
  ["Tom Gugliotta","Golden State Warriors","GSW","1990s","PF|SF",14.4,8.4,4.4,1.4,0.6],
  ["Sarunas Marciulionis","Golden State Warriors","GSW","1990s","SG|PG",18.4,3.4,3.4,2.0,0.4],
  ["Avery Johnson","Golden State Warriors","GSW","1990s","PG",11.4,2.4,6.4,1.6,0.2],
  ["Donyell Marshall","Golden State Warriors","GSW","1990s","PF|SF",14.4,8.4,2.4,1.0,0.8],
  ["Todd Fuller","Golden State Warriors","GSW","1990s","C|PF",6.4,5.4,1.4,0.4,0.8],
  ["Baron Davis","Golden State Warriors","GSW","2000s","PG",20.4,4.4,7.4,2.2,0.4],
  ["Jason Richardson","Golden State Warriors","GSW","2000s","SG|SF",20.4,4.4,3.4,1.4,0.4],
  ["Antawn Jamison","Golden State Warriors","GSW","2000s","PF|SF",22.4,8.4,2.4,1.0,0.6],
  ["Monta Ellis","Golden State Warriors","GSW","2000s","SG|PG",22.4,3.4,4.4,1.8,0.3],
  ["Stephen Jackson","Golden State Warriors","GSW","2000s","SG|SF",16.4,5.4,3.4,1.4,0.6],
  ["Andris Biedrins","Golden State Warriors","GSW","2000s","C",10.4,9.4,1.4,0.8,1.4],
  ["Al Harrington","Golden State Warriors","GSW","2000s","PF|SF",16.4,6.4,2.4,1.0,0.6],
  ["Mike Dunleavy Jr.","Golden State Warriors","GSW","2000s","SF|SG",12.4,4.4,3.4,0.8,0.4],
  ["Gilbert Arenas","Golden State Warriors","GSW","2000s","PG",18.4,4.4,5.4,1.6,0.4],
  ["Matt Barnes","Golden State Warriors","GSW","2000s","SF|PF",10.4,5.4,2.4,1.4,0.6],
  ["Tracy McGrady","Houston Rockets","HOU","2000s","SG|SF",25.4,6.4,5.4,1.4,0.8],
  ["Yao Ming","Houston Rockets","HOU","2000s","C",19.4,9.4,1.8,0.6,2.0],
  ["Shane Battier","Houston Rockets","HOU","2000s","SF|SG",9.4,4.4,2.4,1.4,0.6],
  ["Rafer Alston","Houston Rockets","HOU","2000s","PG",12.4,3.4,5.4,1.4,0.2],
  ["Luis Scola","Houston Rockets","HOU","2000s","PF|C",13.4,7.4,1.4,0.8,0.6],
  ["Carl Landry","Houston Rockets","HOU","2000s","PF|C",12.4,6.4,1.4,0.8,0.6],
  ["Bonzi Wells","Houston Rockets","HOU","2000s","SG|SF",13.4,5.4,3.4,1.4,0.4],
  ["Aaron Brooks","Houston Rockets","HOU","2000s","PG",14.4,2.4,4.4,1.0,0.2],
  ["Mike James","Houston Rockets","HOU","2000s","PG|SG",13.4,3.4,5.4,1.2,0.2],
  ["Chuck Hayes","Houston Rockets","HOU","2000s","C|PF",5.4,7.4,2.4,1.0,0.6],
  ["Jalen Green","Houston Rockets","HOU","2020s","SG|PG",22.4,4.4,3.4,1.2,0.4],
  ["Alperen Sengun","Houston Rockets","HOU","2020s","C|PF",20.4,9.4,4.4,1.0,1.2],
  ["Jabari Smith Jr.","Houston Rockets","HOU","2020s","PF|C",14.4,7.4,1.8,1.0,1.0],
  ["Fred VanVleet","Houston Rockets","HOU","2020s","PG",17.4,3.4,6.4,1.6,0.2],
  ["Dillon Brooks","Houston Rockets","HOU","2020s","SF|SG",13.4,3.4,2.4,1.4,0.4],
  ["Amen Thompson","Houston Rockets","HOU","2020s","SF|SG",11.4,6.4,4.4,1.4,0.6],
  ["Tari Eason","Houston Rockets","HOU","2020s","SF|PF",11.4,5.4,1.8,1.4,0.6],
  ["Cam Whitmore","Houston Rockets","HOU","2020s","SF|SG",14.4,4.4,2.4,1.2,0.4],
  ["Jeff Green","Houston Rockets","HOU","2020s","PF|SF",9.4,4.4,1.8,0.8,0.6],
  ["Aaron Holiday","Houston Rockets","HOU","2020s","PG|SG",8.4,2.4,4.4,1.0,0.2],
  ["Chuck Person","Indiana Pacers","IND","1980s","SF|PF",15.4,5.4,2.4,0.8,0.4],
  ["Detlef Schrempf","Indiana Pacers","IND","1980s","PF|SF",15.4,6.4,3.4,0.8,0.4],
  ["Vern Fleming","Indiana Pacers","IND","1980s","PG|SG",14.4,4.4,6.4,1.4,0.4],
  ["Herb Williams","Indiana Pacers","IND","1980s","C|PF",14.4,7.4,1.8,0.8,1.8],
  ["Clark Kellogg","Indiana Pacers","IND","1980s","PF|SF",16.4,8.4,2.4,1.0,0.6],
  ["Steve Stipanovich","Indiana Pacers","IND","1980s","C",12.4,7.4,2.4,0.6,1.2],
  ["Wayman Tisdale","Indiana Pacers","IND","1980s","PF|C",16.4,7.4,1.4,0.6,0.6],
  ["Bill Garnett","Indiana Pacers","IND","1980s","PF|SF",8.4,5.4,1.8,0.8,0.6],
  ["Quinn Buckner","Indiana Pacers","IND","1980s","PG",9.4,2.8,4.4,1.6,0.3],
  ["Stuart Gray","Indiana Pacers","IND","1980s","C",6.4,5.4,1.4,0.4,0.8],
  ["Jermaine O'Neal","Indiana Pacers","IND","2000s","PF|C",20.4,9.4,2.4,1.0,2.8],
  ["Reggie Miller","Indiana Pacers","IND","2000s","SG|SF",15.4,2.8,2.8,1.0,0.2],
  ["Ron Artest","Indiana Pacers","IND","2000s","SF|SG",16.4,5.4,3.4,2.4,0.6],
  ["Al Harrington","Indiana Pacers","IND","2000s","PF|SF",15.4,6.4,2.4,1.0,0.6],
  ["Jamaal Tinsley","Indiana Pacers","IND","2000s","PG",9.4,3.4,7.4,1.6,0.4],
  ["Stephen Jackson","Indiana Pacers","IND","2000s","SG|SF",15.4,4.4,3.4,1.4,0.4],
  ["Jeff Foster","Indiana Pacers","IND","2000s","C",6.4,8.4,1.4,0.8,0.6],
  ["Primoz Brezec","Indiana Pacers","IND","2000s","C",10.4,7.4,1.4,0.6,1.0],
  ["Fred Jones","Indiana Pacers","IND","2000s","SG|SF",10.4,3.4,2.4,1.2,0.4],
  ["Jonathan Bender","Indiana Pacers","IND","2000s","SF|PF",8.4,4.4,1.8,0.8,1.0],
  ["Paul George","Indiana Pacers","IND","2010s","SF|SG",22.4,6.4,3.8,1.8,0.7],
  ["Roy Hibbert","Indiana Pacers","IND","2010s","C",11.4,7.4,1.4,0.6,2.2],
  ["David West","Indiana Pacers","IND","2010s","PF|C",13.4,6.4,2.8,1.0,1.0],
  ["Lance Stephenson","Indiana Pacers","IND","2010s","SG|SF",12.4,5.4,4.4,1.8,0.4],
  ["George Hill","Indiana Pacers","IND","2010s","PG|SG",14.4,3.4,4.4,1.4,0.4],
  ["Myles Turner","Indiana Pacers","IND","2010s","C|PF",13.4,6.4,1.8,0.8,2.6],
  ["Victor Oladipo","Indiana Pacers","IND","2010s","SG|PG",23.4,5.4,4.4,2.4,0.6],
  ["Thaddeus Young","Indiana Pacers","IND","2010s","PF|SF",12.4,6.4,2.4,1.4,0.4],
  ["Jeff Teague","Indiana Pacers","IND","2010s","PG",14.4,3.4,7.4,1.2,0.2],
  ["Cory Joseph","Indiana Pacers","IND","2010s","PG|SG",9.4,2.8,4.8,1.2,0.2],
  ["Bob Kauffman","Los Angeles Clippers","LAC","1960s","PF|C",14.4,9.4,2.4,1.2,1.0],
  ["Elvin Hayes","Los Angeles Clippers","LAC","1960s","C|PF",22.4,15.2,1.6,1.0,2.0],
  ["Don May","Los Angeles Clippers","LAC","1960s","SF|PF",10.4,5.4,1.8,1.0,0.6],
  ["Herm Gilliam","Los Angeles Clippers","LAC","1960s","SG|SF",12.4,4.4,3.4,1.4,0.3],
  ["Dick Garrett","Los Angeles Clippers","LAC","1960s","SG|PG",14.4,3.4,3.8,1.4,0.2],
  ["Walt Hazzard","Los Angeles Clippers","LAC","1960s","PG|SG",14.4,3.8,5.4,1.4,0.2],
  ["Bill Turner","Los Angeles Clippers","LAC","1960s","SF|PF",11.4,7.4,1.8,1.2,0.6],
  ["Les Hunter","Los Angeles Clippers","LAC","1960s","C|PF",10.4,9.4,1.4,0.9,0.8],
  ["Nate Bowman","Los Angeles Clippers","LAC","1960s","C",6.4,7.4,0.8,1.0,1.8],
  ["Tom Washington","Los Angeles Clippers","LAC","1960s","PF|C",8.4,8.4,1.4,0.9,0.8],
  ["Danny Manning","Los Angeles Clippers","LAC","1980s","SF|PF",18.4,7.4,3.4,1.2,0.8],
  ["Ron Harper","Los Angeles Clippers","LAC","1980s","SG|PG",15.4,4.4,4.4,2.2,0.8],
  ["Charles Smith","Los Angeles Clippers","LAC","1980s","PF|SF",16.4,7.4,2.4,1.0,1.4],
  ["Benoit Benjamin","Los Angeles Clippers","LAC","1980s","C",12.4,9.4,1.4,0.6,2.2],
  ["Gary Grant","Los Angeles Clippers","LAC","1980s","PG|SG",11.4,3.4,6.4,2.2,0.3],
  ["Ken Norman","Los Angeles Clippers","LAC","1980s","SF|PF",15.4,6.4,2.8,1.0,0.6],
  ["Michael Cage","Los Angeles Clippers","LAC","1980s","C|PF",10.4,10.4,1.8,0.8,0.8],
  ["Winston Garland","Los Angeles Clippers","LAC","1980s","PG",11.4,3.8,6.4,1.8,0.2],
  ["Quintin Dailey","Los Angeles Clippers","LAC","1980s","SG|PG",16.4,3.4,2.8,1.0,0.2],
  ["Joe Wolf","Los Angeles Clippers","LAC","1980s","PF|C",8.4,5.4,2.4,0.6,0.6],
  ["Danny Manning","Los Angeles Clippers","LAC","1990s","SF|PF",16.4,6.4,3.4,1.2,0.8],
  ["Loy Vaught","Los Angeles Clippers","LAC","1990s","PF|C",13.4,9.4,1.8,0.8,0.8],
  ["Lamond Murray","Los Angeles Clippers","LAC","1990s","SF|SG",13.4,5.4,2.4,1.0,0.4],
  ["Brent Barry","Los Angeles Clippers","LAC","1990s","SG|SF",12.4,3.4,3.4,1.4,0.4],
  ["Pooh Richardson","Los Angeles Clippers","LAC","1990s","PG",12.4,3.4,7.4,1.6,0.2],
  ["Rodney Rogers","Los Angeles Clippers","LAC","1990s","SF|PF",11.4,5.4,2.4,1.0,0.6],
  ["Lorenzen Wright","Los Angeles Clippers","LAC","1990s","C|PF",8.4,7.4,1.4,0.6,0.8],
  ["Eric Piatkowski","Los Angeles Clippers","LAC","1990s","SG|SF",11.4,3.4,2.4,0.8,0.3],
  ["Derek Anderson","Los Angeles Clippers","LAC","1990s","SG|SF",13.4,3.4,3.4,1.4,0.4],
  ["Charles Outlaw","Los Angeles Clippers","LAC","1990s","SF|PF",6.4,6.4,1.8,1.4,1.0],
  ["Elton Brand","Los Angeles Clippers","LAC","2000s","PF|C",20.4,10.4,2.8,1.2,1.8],
  ["Corey Maggette","Los Angeles Clippers","LAC","2000s","SF|SG",20.4,5.4,2.4,1.2,0.4],
  ["Chris Kaman","Los Angeles Clippers","LAC","2000s","C",13.4,9.4,1.4,0.8,1.8],
  ["Cuttino Mobley","Los Angeles Clippers","LAC","2000s","SG|SF",15.4,3.4,3.4,1.4,0.3],
  ["Darius Miles","Los Angeles Clippers","LAC","2000s","SF|PF",11.4,5.4,2.4,1.0,0.6],
  ["Sam Cassell","Los Angeles Clippers","LAC","2000s","PG",18.4,3.4,6.4,1.2,0.2],
  ["Zach Randolph","Los Angeles Clippers","LAC","2000s","PF|C",18.4,9.4,2.4,0.8,0.4],
  ["Shaun Livingston","Los Angeles Clippers","LAC","2000s","PG|SG",9.4,4.4,4.4,1.2,0.4],
  ["Quentin Richardson","Los Angeles Clippers","LAC","2000s","SG|SF",14.4,5.4,2.4,1.0,0.4],
  ["Marko Jaric","Los Angeles Clippers","LAC","2000s","PG|SG",9.4,3.4,4.4,1.4,0.3],
  ["Blake Griffin","Los Angeles Clippers","LAC","2010s","PF|C",23.4,9.4,4.4,1.0,0.8],
  ["Chris Paul","Los Angeles Clippers","LAC","2010s","PG",19.2,4.6,9.9,2.2,0.2],
  ["DeAndre Jordan","Los Angeles Clippers","LAC","2010s","C",12.4,13.4,1.4,0.8,1.8],
  ["Jamal Crawford","Los Angeles Clippers","LAC","2010s","SG|PG",18.4,2.4,3.4,0.8,0.2],
  ["Kawhi Leonard","Los Angeles Clippers","LAC","2010s","SF|PF",26.4,6.4,5.4,1.8,0.6],
  ["Paul George","Los Angeles Clippers","LAC","2010s","SF|SG",24.4,6.4,4.4,2.2,0.7],
  ["Reggie Jackson","Los Angeles Clippers","LAC","2010s","PG|SG",14.4,3.4,5.4,1.0,0.3],
  ["Marcus Morris Sr.","Los Angeles Clippers","LAC","2010s","PF|SF",13.4,5.4,2.4,0.8,0.4],
  ["Ivica Zubac","Los Angeles Clippers","LAC","2010s","C",10.4,9.4,1.8,0.6,1.2],
  ["Lou Williams","Los Angeles Clippers","LAC","2010s","PG|SG",18.4,2.4,4.4,0.8,0.2],
  ["Kawhi Leonard","Los Angeles Clippers","LAC","2020s","SF|PF",23.4,6.4,3.4,1.4,0.4],
  ["Paul George","Los Angeles Clippers","LAC","2020s","SF|SG",21.4,5.4,5.4,1.8,0.7],
  ["James Harden","Los Angeles Clippers","LAC","2020s","SG|PG",17.4,5.4,8.4,1.2,0.4],
  ["Ivica Zubac","Los Angeles Clippers","LAC","2020s","C",13.4,10.4,2.4,0.8,1.4],
  ["Norman Powell","Los Angeles Clippers","LAC","2020s","SG|SF",18.4,3.4,2.4,1.0,0.3],
  ["Russell Westbrook","Los Angeles Clippers","LAC","2020s","PG",15.9,6.4,7.2,1.2,0.4],
  ["Terance Mann","Los Angeles Clippers","LAC","2020s","SF|SG",12.4,4.4,2.8,1.0,0.4],
  ["Mason Plumlee","Los Angeles Clippers","LAC","2020s","C|PF",7.4,6.4,2.4,0.6,0.8],
  ["Bones Hyland","Los Angeles Clippers","LAC","2020s","PG|SG",10.4,2.8,3.4,0.8,0.2],
  ["P.J. Tucker","Los Angeles Clippers","LAC","2020s","PF|SF",5.4,4.4,1.8,1.0,0.4],
  ["Shaquille O'Neal","Los Angeles Lakers","LAL","1990s","C",26.4,11.4,2.8,0.6,2.4],
  ["Kobe Bryant","Los Angeles Lakers","LAL","1990s","SG|SF",19.8,4.8,3.8,1.6,0.4],
  ["Nick Van Exel","Los Angeles Lakers","LAL","1990s","PG",16.4,3.4,7.4,1.0,0.2],
  ["Eddie Jones","Los Angeles Lakers","LAL","1990s","SG|SF",16.4,4.4,3.4,2.4,0.6],
  ["Vlade Divac","Los Angeles Lakers","LAL","1990s","C",11.4,8.4,3.4,1.2,1.4],
  ["Robert Horry","Los Angeles Lakers","LAL","1990s","PF|SF",9.4,5.4,3.4,1.4,1.0],
  ["Cedric Ceballos","Los Angeles Lakers","LAL","1990s","SF|PF",17.4,6.4,2.4,0.8,0.4],
  ["Elden Campbell","Los Angeles Lakers","LAL","1990s","C|PF",11.4,7.4,1.4,0.8,1.8],
  ["Sedale Threatt","Los Angeles Lakers","LAL","1990s","PG|SG",12.4,3.4,5.4,1.6,0.2],
  ["Byron Scott","Los Angeles Lakers","LAL","1990s","SG|SF",9.4,2.8,2.4,0.8,0.2],
  ["Kobe Bryant","Los Angeles Lakers","LAL","2010s","SG|SF",27.4,5.4,4.4,1.4,0.4],
  ["Pau Gasol","Los Angeles Lakers","LAL","2010s","PF|C",18.4,9.4,3.4,0.6,1.6],
  ["Dwight Howard","Los Angeles Lakers","LAL","2010s","C",17.4,12.4,1.8,1.4,2.4],
  ["Steve Nash","Los Angeles Lakers","LAL","2010s","PG",13.4,2.8,9.4,0.6,0.1],
  ["Jordan Clarkson","Los Angeles Lakers","LAL","2010s","PG|SG",14.4,3.4,3.4,0.8,0.2],
  ["Julius Randle","Los Angeles Lakers","LAL","2010s","PF|C",14.4,8.4,2.4,0.8,0.6],
  ["Brandon Ingram","Los Angeles Lakers","LAL","2010s","SF|PF",14.4,5.4,3.4,0.8,0.4],
  ["Nick Young","Los Angeles Lakers","LAL","2010s","SG|SF",13.4,2.4,1.4,0.6,0.2],
  ["Lou Williams","Los Angeles Lakers","LAL","2010s","PG|SG",15.4,2.4,3.4,0.8,0.2],
  ["Metta World Peace","Los Angeles Lakers","LAL","2010s","SF|SG",9.4,3.4,2.4,1.4,0.7],
  ["Pau Gasol","Memphis Grizzlies","MEM","2000s","C|PF",18.4,8.4,3.4,0.8,1.8],
  ["Mike Miller","Memphis Grizzlies","MEM","2000s","SF|SG",14.4,5.4,3.4,1.0,0.4],
  ["Shane Battier","Memphis Grizzlies","MEM","2000s","SF|SG",9.4,4.4,2.4,1.4,0.6],
  ["Jason Williams","Memphis Grizzlies","MEM","2000s","PG",12.4,3.4,6.4,1.4,0.2],
  ["Stromile Swift","Memphis Grizzlies","MEM","2000s","PF|C",10.4,5.4,1.4,0.8,1.6],
  ["Bobby Jackson","Memphis Grizzlies","MEM","2000s","PG|SG",14.4,3.4,4.4,1.4,0.2],
  ["Earl Watson","Memphis Grizzlies","MEM","2000s","PG",8.4,3.4,6.4,1.4,0.2],
  ["Wesley Person","Memphis Grizzlies","MEM","2000s","SG|SF",11.4,3.4,2.4,0.8,0.4],
  ["Lorenzen Wright","Memphis Grizzlies","MEM","2000s","C|PF",8.4,6.4,1.4,0.6,0.6],
  ["James Posey","Memphis Grizzlies","MEM","2000s","SF|PF",9.4,4.4,2.4,1.4,0.4],
  ["Rudy Gay","Memphis Grizzlies","MEM","2010s","SF|SG",19.4,6.4,2.8,1.4,0.6],
  ["Marc Gasol","Memphis Grizzlies","MEM","2010s","C",16.4,7.4,3.4,1.4,1.8],
  ["Zach Randolph","Memphis Grizzlies","MEM","2010s","PF|C",19.4,11.4,2.4,0.8,0.4],
  ["Mike Conley","Memphis Grizzlies","MEM","2010s","PG",16.4,3.4,6.4,1.6,0.2],
  ["Tony Allen","Memphis Grizzlies","MEM","2010s","SG|SF",8.4,3.4,2.4,2.2,0.4],
  ["Ja Morant","Memphis Grizzlies","MEM","2010s","PG",22.4,5.4,7.4,1.0,0.4],
  ["Jaren Jackson Jr.","Memphis Grizzlies","MEM","2010s","PF|C",16.4,6.2,1.8,1.0,3.4],
  ["Jonas Valanciunas","Memphis Grizzlies","MEM","2010s","C",16.4,10.4,2.4,0.8,1.1],
  ["Dillon Brooks","Memphis Grizzlies","MEM","2010s","SF|SG",15.4,3.4,2.4,1.0,0.4],
  ["Brandon Clarke","Memphis Grizzlies","MEM","2010s","PF|C",12.4,5.4,1.4,0.6,1.2],
  ["Ja Morant","Memphis Grizzlies","MEM","2020s","PG",26.4,5.4,8.4,1.2,0.4],
  ["Jaren Jackson Jr.","Memphis Grizzlies","MEM","2020s","PF|C",20.4,6.4,2.4,1.4,3.4],
  ["Desmond Bane","Memphis Grizzlies","MEM","2020s","SG|SF",21.4,4.4,4.4,1.4,0.4],
  ["Steven Adams","Memphis Grizzlies","MEM","2020s","C",7.4,10.4,2.4,0.8,0.8],
  ["Ziaire Williams","Memphis Grizzlies","MEM","2020s","SF|SG",12.4,4.4,2.4,1.0,0.4],
  ["Tyus Jones","Memphis Grizzlies","MEM","2020s","PG",9.4,3.4,6.4,1.4,0.2],
  ["John Konchar","Memphis Grizzlies","MEM","2020s","SG|SF",8.4,4.4,2.4,1.0,0.3],
  ["Xavier Tillman","Memphis Grizzlies","MEM","2020s","PF|C",7.4,5.4,1.8,1.0,0.8],
  ["David Roddy","Memphis Grizzlies","MEM","2020s","SF|PF",9.4,4.4,2.4,0.8,0.4],
  ["Santi Aldama","Memphis Grizzlies","MEM","2020s","PF|C",11.4,5.4,2.4,0.8,0.8],
                                              ["Glen Rice","Miami Heat","MIA","1990s","SG|SF",20.4,4.4,2.4,1.0,0.4],
  ["Rony Seikaly","Miami Heat","MIA","1990s","C|PF",14.4,9.4,1.8,0.8,1.4],
  ["Sherman Douglas","Miami Heat","MIA","1990s","PG",14.4,3.4,8.4,1.4,0.2],
  ["Kevin Willis","Miami Heat","MIA","1990s","PF|C",14.4,10.4,1.4,0.8,0.8],
  ["Bimbo Coles","Miami Heat","MIA","1990s","PG",12.4,3.4,5.4,1.6,0.2],
  ["P.J. Brown","Miami Heat","MIA","1990s","PF|C",9.4,7.4,2.4,1.0,1.0],
  ["Tim Hardaway","Miami Heat","MIA","1990s","PG",18.4,3.4,7.4,1.8,0.3],
  ["Keith Askins","Miami Heat","MIA","1990s","SF|PF",5.4,3.4,1.4,1.0,0.4],
  ["Dan Majerle","Miami Heat","MIA","1990s","SG|SF",14.4,4.4,3.4,1.4,0.4],
  ["Voshon Lenard","Miami Heat","MIA","1990s","SG|SF",12.4,2.8,2.4,0.8,0.2],
  ["Jimmy Butler","Miami Heat","MIA","2020s","SF|SG",20.4,5.4,5.4,1.8,0.4],
  ["Bam Adebayo","Miami Heat","MIA","2020s","C|PF",19.4,10.4,3.4,1.2,1.2],
  ["Tyler Herro","Miami Heat","MIA","2020s","SG|PG",20.4,4.4,4.4,0.8,0.3],
  ["Kyle Lowry","Miami Heat","MIA","2020s","PG",13.4,4.4,7.4,1.2,0.2],
  ["Duncan Robinson","Miami Heat","MIA","2020s","SG|SF",14.4,3.4,2.4,0.6,0.2],
  ["Max Strus","Miami Heat","MIA","2020s","SG|SF",11.4,4.4,2.4,0.8,0.3],
  ["Caleb Martin","Miami Heat","MIA","2020s","SF|SG",10.4,4.4,2.4,1.4,0.4],
  ["Haywood Highsmith","Miami Heat","MIA","2020s","SF|PF",8.4,4.4,1.8,1.0,0.4],
  ["Kevin Love","Miami Heat","MIA","2020s","PF|C",10.4,9.8,2.4,0.6,0.4],
  ["Victor Oladipo","Miami Heat","MIA","2020s","SG|SF",13.4,3.4,3.4,1.4,0.4],
  ["Kareem Abdul-Jabbar","Milwaukee Bucks","MIL","1960s","C",28.8,14.4,3.8,1.2,4.2],
  ["Oscar Robertson","Milwaukee Bucks","MIL","1960s","PG|SG",18.4,5.8,8.2,1.1,0.1],
  ["Bob Dandridge","Milwaukee Bucks","MIL","1960s","SF|PF",16.8,7.0,3.2,1.3,0.8],
  ["Jon McGlocklin","Milwaukee Bucks","MIL","1960s","SG",14.4,2.8,2.4,0.8,0.2],
  ["Bob Boozer","Milwaukee Bucks","MIL","1960s","PF|C",12.4,7.4,1.8,0.9,1.0],
  ["Greg Smith","Milwaukee Bucks","MIL","1960s","PF|C",7.4,7.4,1.4,0.8,0.8],
  ["Fred Crawford","Milwaukee Bucks","MIL","1960s","SG|PG",9.4,2.4,3.4,1.4,0.2],
  ["Bob Love","Milwaukee Bucks","MIL","1960s","SF|SG",10.4,4.4,1.8,1.0,0.4],
  ["Jeff Webb","Milwaukee Bucks","MIL","1960s","SG|PG",7.4,2.4,3.4,1.2,0.2],
  ["Len Chappell","Milwaukee Bucks","MIL","1960s","PF|C",10.4,7.4,1.4,0.8,0.8],
  ["Terry Cummings","Milwaukee Bucks","MIL","1980s","PF|SF",22.4,8.4,2.4,1.0,0.8],
  ["Sidney Moncrief","Milwaukee Bucks","MIL","1980s","SG|PG",20.4,4.4,4.4,2.2,0.4],
  ["Bob Lanier","Milwaukee Bucks","MIL","1980s","C",17.4,9.4,3.4,0.8,1.4],
  ["Ricky Pierce","Milwaukee Bucks","MIL","1980s","SG|PG",19.4,3.4,3.4,1.2,0.3],
  ["Paul Pressey","Milwaukee Bucks","MIL","1980s","PG|SF",10.4,5.4,6.4,1.8,0.4],
  ["Marques Johnson","Milwaukee Bucks","MIL","1980s","SF|SG",19.4,6.4,3.4,1.2,0.6],
  ["Jack Sikma","Milwaukee Bucks","MIL","1980s","C",14.4,8.4,4.4,1.4,1.0],
  ["Craig Hodges","Milwaukee Bucks","MIL","1980s","PG|SG",11.4,2.4,4.4,1.2,0.2],
  ["Alton Lister","Milwaukee Bucks","MIL","1980s","C|PF",8.4,7.4,1.4,0.6,2.0],
  ["Randy Breuer","Milwaukee Bucks","MIL","1980s","C",8.4,6.4,1.4,0.6,1.4],
  ["Ray Allen","Milwaukee Bucks","MIL","2000s","SG|SF",21.8,4.2,3.4,1.4,0.3],
  ["Sam Cassell","Milwaukee Bucks","MIL","2000s","PG",19.4,3.4,6.4,1.4,0.2],
  ["Glenn Robinson","Milwaukee Bucks","MIL","2000s","SF|PF",21.4,6.4,2.4,1.0,0.4],
  ["Michael Redd","Milwaukee Bucks","MIL","2000s","SG|SF",23.4,4.4,2.4,1.0,0.3],
  ["Andrew Bogut","Milwaukee Bucks","MIL","2000s","C",12.4,9.4,1.8,0.8,1.8],
  ["Desmond Mason","Milwaukee Bucks","MIL","2000s","SF|SG",14.4,4.4,2.4,1.0,0.4],
  ["T.J. Ford","Milwaukee Bucks","MIL","2000s","PG",12.4,3.4,6.4,1.4,0.2],
  ["Bobby Simmons","Milwaukee Bucks","MIL","2000s","SF|SG",12.4,5.4,2.4,1.2,0.4],
  ["Jamaal Magloire","Milwaukee Bucks","MIL","2000s","C",11.4,9.4,1.4,0.6,0.8],
  ["Yi Jianlian","Milwaukee Bucks","MIL","2000s","PF|C",9.4,5.4,1.4,0.6,0.8],
                                              ["Christian Laettner","Minnesota Timberwolves","MIN","1990s","PF|C",14.4,7.4,2.4,0.8,0.8],
  ["Kevin Garnett","Minnesota Timberwolves","MIN","1990s","PF|C",20.2,11.2,4.4,1.8,2.6],
  ["Isaiah Rider","Minnesota Timberwolves","MIN","1990s","SG|SF",18.4,3.4,2.4,1.2,0.3],
  ["Tom Gugliotta","Minnesota Timberwolves","MIN","1990s","PF|SF",17.4,9.4,4.4,1.4,0.6],
  ["Terry Porter","Minnesota Timberwolves","MIN","1990s","PG",11.4,3.4,5.4,1.4,0.2],
  ["Sam Mitchell","Minnesota Timberwolves","MIN","1990s","SF|PF",10.4,4.4,2.4,0.8,0.4],
  ["Bobby Jackson","Minnesota Timberwolves","MIN","1990s","PG|SG",13.4,3.4,4.8,1.6,0.2],
  ["Malik Sealy","Minnesota Timberwolves","MIN","1990s","SG|SF",11.4,3.4,2.4,1.2,0.3],
  ["Pooh Richardson","Minnesota Timberwolves","MIN","1990s","PG",12.4,3.4,7.8,1.6,0.2],
  ["Cherokee Parks","Minnesota Timberwolves","MIN","1990s","C|PF",7.4,5.4,1.4,0.6,0.6],
  ["Kevin Garnett","Minnesota Timberwolves","MIN","2010s","PF|C",13.4,8.4,2.8,1.0,1.2],
  ["Ricky Rubio","Minnesota Timberwolves","MIN","2010s","PG",10.4,4.4,8.4,2.2,0.2],
  ["Kevin Love","Minnesota Timberwolves","MIN","2010s","PF|C",22.4,14.4,2.4,0.8,0.4],
  ["Andrew Wiggins","Minnesota Timberwolves","MIN","2010s","SG|SF",20.4,4.4,2.4,1.0,0.4],
  ["Karl-Anthony Towns","Minnesota Timberwolves","MIN","2010s","C|PF",21.4,11.4,3.4,1.0,1.4],
  ["Jimmy Butler","Minnesota Timberwolves","MIN","2010s","SG|SF",22.4,5.4,4.4,2.0,0.4],
  ["Zach LaVine","Minnesota Timberwolves","MIN","2010s","SG|PG",17.4,3.4,3.4,1.0,0.4],
  ["Jeff Teague","Minnesota Timberwolves","MIN","2010s","PG",14.4,3.4,6.4,1.2,0.2],
  ["Taj Gibson","Minnesota Timberwolves","MIN","2010s","PF|C",10.4,7.4,1.4,0.8,1.0],
  ["Gorgui Dieng","Minnesota Timberwolves","MIN","2010s","C|PF",10.4,7.4,2.4,0.8,1.0],
                              ["Chris Paul","New Orleans Pelicans","NOP","2000s","PG",21.4,4.4,10.8,2.4,0.2],
  ["Peja Stojakovic","New Orleans Pelicans","NOP","2000s","SF|SG",18.4,4.4,2.4,0.8,0.3],
  ["David West","New Orleans Pelicans","NOP","2000s","PF|C",14.4,7.4,3.4,1.0,0.8],
  ["P.J. Brown","New Orleans Pelicans","NOP","2000s","PF|C",10.4,8.4,2.4,1.0,1.0],
  ["Rasual Butler","New Orleans Pelicans","NOP","2000s","SF|SG",10.4,3.4,2.4,0.8,0.4],
  ["Mike James","New Orleans Pelicans","NOP","2000s","PG",14.4,3.4,5.4,1.2,0.2],
  ["Desmond Mason","New Orleans Pelicans","NOP","2000s","SF|SG",13.4,4.4,2.4,1.0,0.4],
  ["Lee Nailon","New Orleans Pelicans","NOP","2000s","SF|PF",10.4,4.4,1.4,0.6,0.4],
  ["Robert Pack","New Orleans Pelicans","NOP","2000s","PG",9.4,2.8,5.4,1.4,0.2],
  ["Zion Williamson","New Orleans Pelicans","NOP","2020s","PF|C",25.4,7.4,4.4,1.2,0.7],
  ["Brandon Ingram","New Orleans Pelicans","NOP","2020s","SF|PF",22.4,5.4,4.4,1.0,0.4],
  ["CJ McCollum","New Orleans Pelicans","NOP","2020s","SG|PG",20.4,4.4,4.4,1.0,0.3],
  ["Jonas Valanciunas","New Orleans Pelicans","NOP","2020s","C",14.4,12.4,2.4,0.6,1.1],
  ["Herbert Jones","New Orleans Pelicans","NOP","2020s","SF|SG",9.4,4.4,2.4,1.8,0.8],
  ["Jose Alvarado","New Orleans Pelicans","NOP","2020s","PG",9.4,3.4,3.4,2.4,0.4],
  ["Trey Murphy III","New Orleans Pelicans","NOP","2020s","SF|SG",14.4,4.4,2.4,0.8,0.4],
  ["Naji Marshall","New Orleans Pelicans","NOP","2020s","SF|SG",12.4,4.4,2.8,1.2,0.4],
  ["Dyson Daniels","New Orleans Pelicans","NOP","2020s","SG|SF",11.4,4.4,3.4,2.4,0.4],
  ["Larry Nance Jr.","New Orleans Pelicans","NOP","2020s","PF|SF",8.4,6.4,2.4,1.2,1.2],
  ["Allan Houston","New York Knicks","NYK","2000s","SG",16.4,3.4,2.4,0.8,0.2],
  ["Stephon Marbury","New York Knicks","NYK","2000s","PG",20.4,3.4,8.4,1.0,0.2],
  ["Jamal Crawford","New York Knicks","NYK","2000s","SG|PG",14.4,2.4,4.4,1.0,0.2],
  ["Eddy Curry","New York Knicks","NYK","2000s","C",14.4,5.4,1.4,0.4,0.8],
  ["David Lee","New York Knicks","NYK","2000s","PF|C",15.4,10.4,2.4,0.8,0.4],
  ["Nate Robinson","New York Knicks","NYK","2000s","PG",14.4,3.4,4.4,1.2,0.3],
  ["Quentin Richardson","New York Knicks","NYK","2000s","SG|SF",11.4,5.4,2.4,1.0,0.4],
  ["Channing Frye","New York Knicks","NYK","2000s","PF|C",8.4,5.4,1.8,0.6,0.8],
  ["Jared Jeffries","New York Knicks","NYK","2000s","SF|PF",6.4,4.4,2.4,1.2,0.8],
  ["Malik Rose","New York Knicks","NYK","2000s","PF|C",8.4,6.4,1.4,0.6,0.6],
  ["Carmelo Anthony","New York Knicks","NYK","2010s","SF|PF",24.4,6.4,2.4,0.8,0.5],
  ["Amar'e Stoudemire","New York Knicks","NYK","2010s","PF|C",21.4,9.4,1.8,0.6,1.4],
  ["Kristaps Porzingis","New York Knicks","NYK","2010s","C|PF",18.4,7.4,1.8,0.8,2.4],
  ["Tyson Chandler","New York Knicks","NYK","2010s","C",7.4,11.4,1.4,0.6,1.2],
  ["Raymond Felton","New York Knicks","NYK","2010s","PG",13.4,3.4,6.4,1.2,0.2],
  ["J.R. Smith","New York Knicks","NYK","2010s","SG|SF",14.4,3.4,2.4,1.2,0.3],
  ["Joakim Noah","New York Knicks","NYK","2010s","C",7.4,8.4,4.4,0.8,1.2],
  ["Tim Hardaway Jr.","New York Knicks","NYK","2010s","SG|SF",14.4,3.4,1.8,0.8,0.3],
  ["Enes Kanter","New York Knicks","NYK","2010s","C|PF",14.4,10.4,1.4,0.6,0.6],
  ["Courtney Lee","New York Knicks","NYK","2010s","SG|SF",11.4,3.4,2.4,1.0,0.3],
  ["Julius Randle","New York Knicks","NYK","2020s","PF|C",22.4,10.4,5.4,0.8,0.7],
  ["RJ Barrett","New York Knicks","NYK","2020s","SG|SF",19.4,5.4,3.4,0.8,0.3],
  ["Jalen Brunson","New York Knicks","NYK","2020s","PG",26.4,3.4,6.4,0.8,0.2],
  ["OG Anunoby","New York Knicks","NYK","2020s","SF|SG",14.4,5.4,2.4,1.8,1.0],
  ["Karl-Anthony Towns","New York Knicks","NYK","2020s","C|PF",22.4,10.4,3.4,0.8,0.8],
  ["Mikal Bridges","New York Knicks","NYK","2020s","SF|SG",19.4,4.4,3.4,1.0,0.4],
  ["Mitchell Robinson","New York Knicks","NYK","2020s","C",8.4,10.4,0.8,0.8,2.4],
  ["Josh Hart","New York Knicks","NYK","2020s","SF|SG",9.4,8.4,4.4,1.4,0.4],
  ["Donte DiVincenzo","New York Knicks","NYK","2020s","SG|PG",14.4,4.4,2.8,1.4,0.4],
  ["Isaiah Hartenstein","New York Knicks","NYK","2020s","C|PF",7.4,9.4,3.4,1.2,1.4],
  ["Bob Rule","Oklahoma City Thunder","OKC","1960s","SF|PF",18.4,6.4,2.4,1.2,0.6],
  ["Lenny Wilkens","Oklahoma City Thunder","OKC","1960s","PG|SG",18.4,4.4,8.4,1.4,0.2],
  ["Bob Boozer","Oklahoma City Thunder","OKC","1960s","PF|C",14.4,8.4,1.8,0.9,1.0],
  ["Walt Hazzard","Oklahoma City Thunder","OKC","1960s","PG|SG",13.4,3.8,5.4,1.4,0.2],
  ["Tom Meschery","Oklahoma City Thunder","OKC","1960s","PF|SF",12.4,8.4,2.4,1.0,0.8],
  ["Rod Thorn","Oklahoma City Thunder","OKC","1960s","SG|PG",14.4,3.4,4.4,1.4,0.3],
  ["Tommy Kron","Oklahoma City Thunder","OKC","1960s","PG|SG",9.4,3.4,4.8,1.4,0.2],
  ["Al Tucker","Oklahoma City Thunder","OKC","1960s","SF|PF",14.4,7.4,3.4,1.2,0.6],
  ["Barry Clemens","Oklahoma City Thunder","OKC","1960s","SF|SG",10.4,4.4,2.4,1.2,0.4],
  ["Bob Weiss","Oklahoma City Thunder","OKC","1960s","PG|SG",9.4,2.8,4.8,1.4,0.2],
  ["Spencer Haywood","Oklahoma City Thunder","OKC","1970s","PF|C",23.4,12.4,2.4,1.2,1.2],
  ["Fred Brown","Oklahoma City Thunder","OKC","1970s","SG|PG",17.4,3.4,3.4,1.4,0.3],
  ["Slick Watts","Oklahoma City Thunder","OKC","1970s","PG",10.4,4.4,7.4,3.4,0.3],
  ["Jack Sikma","Oklahoma City Thunder","OKC","1970s","C",16.4,11.4,3.4,1.4,1.0],
  ["Gus Williams","Oklahoma City Thunder","OKC","1970s","PG|SG",17.4,3.4,5.4,2.4,0.3],
  ["Dennis Johnson","Oklahoma City Thunder","OKC","1970s","SG|PG",13.4,3.4,4.4,1.8,0.8],
  ["John Johnson","Oklahoma City Thunder","OKC","1970s","SF|PF",12.4,5.4,4.4,1.4,0.6],
  ["Marvin Webster","Oklahoma City Thunder","OKC","1970s","C",12.4,11.4,1.4,0.6,2.4],
  ["Lonnie Shelton","Oklahoma City Thunder","OKC","1970s","PF|C",13.4,6.4,1.8,1.2,0.8],
  ["Paul Silas","Oklahoma City Thunder","OKC","1970s","PF|C",8.4,11.4,2.8,1.0,0.4],
  ["Jack Sikma","Oklahoma City Thunder","OKC","1980s","C",16.4,9.4,3.4,1.4,1.0],
  ["Gus Williams","Oklahoma City Thunder","OKC","1980s","PG|SG",20.4,3.4,6.4,2.4,0.3],
  ["Tom Chambers","Oklahoma City Thunder","OKC","1980s","PF|C",18.4,6.4,2.4,0.8,0.4],
  ["Dale Ellis","Oklahoma City Thunder","OKC","1980s","SG|SF",24.4,3.4,2.4,1.0,0.3],
  ["Xavier McDaniel","Oklahoma City Thunder","OKC","1980s","SF|PF",18.4,6.4,2.4,1.2,0.6],
  ["Alton Lister","Oklahoma City Thunder","OKC","1980s","C",8.4,7.4,1.4,0.6,2.2],
  ["Derrick McKey","Oklahoma City Thunder","OKC","1980s","SF|PF",11.4,5.4,2.8,1.2,0.6],
  ["Maurice Lucas","Oklahoma City Thunder","OKC","1980s","PF|C",12.4,7.4,2.4,1.0,0.6],
  ["Ricky Pierce","Oklahoma City Thunder","OKC","1980s","SG|PG",13.4,2.8,2.4,1.0,0.2],
  ["Danny Young","Oklahoma City Thunder","OKC","1980s","PG|SG",7.4,2.4,5.4,1.4,0.2],
  ["Ray Allen","Oklahoma City Thunder","OKC","2000s","SG|SF",24.4,4.4,3.4,1.2,0.3],
  ["Rashard Lewis","Oklahoma City Thunder","OKC","2000s","PF|SF",18.4,6.4,2.4,0.8,0.8],
  ["Vince Carter","Oklahoma City Thunder","OKC","2000s","SG|SF",18.4,4.4,3.4,1.2,0.4],
  ["Luke Ridnour","Oklahoma City Thunder","OKC","2000s","PG",10.4,2.8,5.4,1.2,0.2],
  ["Chris Wilcox","Oklahoma City Thunder","OKC","2000s","PF|C",10.4,6.4,1.4,0.8,0.8],
  ["Damien Wilkins","Oklahoma City Thunder","OKC","2000s","SG|SF",9.4,3.4,2.4,1.2,0.4],
  ["Brent Barry","Oklahoma City Thunder","OKC","2000s","SG|SF",10.4,3.4,3.4,1.2,0.2],
  ["Johan Petro","Oklahoma City Thunder","OKC","2000s","C|PF",7.4,5.4,1.4,0.6,1.0],
  ["Nick Collison","Oklahoma City Thunder","OKC","2000s","PF|C",6.4,5.4,1.8,0.8,0.6],
  ["Earl Watson","Oklahoma City Thunder","OKC","2000s","PG",8.4,3.4,5.4,1.4,0.2],
                                                              ["Nikola Vucevic","Orlando Magic","ORL","2010s","C|PF",18.4,10.4,3.4,0.8,1.0],
  ["Evan Fournier","Orlando Magic","ORL","2010s","SG|SF",17.4,3.4,3.4,0.8,0.3],
  ["Victor Oladipo","Orlando Magic","ORL","2010s","SG|PG",19.4,4.4,4.4,1.4,0.4],
  ["Aaron Gordon","Orlando Magic","ORL","2010s","PF|SF",14.4,7.4,3.4,1.0,1.0],
  ["Bismack Biyombo","Orlando Magic","ORL","2010s","C",8.4,8.4,1.4,0.6,1.6],
  ["Elfrid Payton","Orlando Magic","ORL","2010s","PG",12.4,5.4,6.4,1.8,0.2],
  ["Terrence Ross","Orlando Magic","ORL","2010s","SG|SF",14.4,3.4,2.4,1.0,0.4],
  ["Jonathan Isaac","Orlando Magic","ORL","2010s","SF|PF",11.4,6.4,1.8,1.4,2.4],
  ["DJ Augustin","Orlando Magic","ORL","2010s","PG",12.4,2.4,4.4,1.0,0.2],
  ["Al-Farouq Aminu","Orlando Magic","ORL","2010s","SF|PF",8.4,6.4,1.8,1.2,0.6],
  ["Paolo Banchero","Orlando Magic","ORL","2020s","PF|SF",22.4,6.9,4.4,0.8,0.9],
  ["Franz Wagner","Orlando Magic","ORL","2020s","SF|SG",20.4,5.4,4.4,1.0,0.4],
  ["Jalen Suggs","Orlando Magic","ORL","2020s","PG|SG",13.4,4.4,5.4,1.6,0.4],
  ["Wendell Carter Jr.","Orlando Magic","ORL","2020s","C|PF",13.4,8.4,2.4,0.8,1.0],
  ["Moritz Wagner","Orlando Magic","ORL","2020s","C|PF",12.4,5.4,1.8,0.6,0.6],
  ["Markelle Fultz","Orlando Magic","ORL","2020s","PG",13.4,3.4,5.4,1.2,0.4],
  ["Jonathan Isaac","Orlando Magic","ORL","2020s","SF|PF",9.4,5.4,1.8,1.4,2.2],
  ["Gary Harris","Orlando Magic","ORL","2020s","SG|SF",10.4,3.4,2.4,1.0,0.3],
  ["Anthony Black","Orlando Magic","ORL","2020s","PG|SG",10.4,4.4,4.4,1.4,0.6],
  ["Chuma Okeke","Orlando Magic","ORL","2020s","SF|PF",8.4,5.4,1.8,1.0,0.6],
  ["Charles Barkley","Philadelphia 76ers","PHI","1990s","PF|C",24.4,11.4,3.4,1.4,1.0],
  ["Hersey Hawkins","Philadelphia 76ers","PHI","1990s","SG|SF",19.4,4.4,3.4,1.8,0.4],
  ["Jeff Hornacek","Philadelphia 76ers","PHI","1990s","SG|PG",16.4,3.4,4.4,1.6,0.4],
  ["Dana Barros","Philadelphia 76ers","PHI","1990s","PG",19.4,2.8,5.4,1.4,0.2],
  ["Clarence Weatherspoon","Philadelphia 76ers","PHI","1990s","PF|SF",14.4,8.4,2.4,1.0,1.2],
  ["Derrick Coleman","Philadelphia 76ers","PHI","1990s","PF|C",17.4,9.4,3.4,1.2,1.2],
  ["Johnny Dawkins","Philadelphia 76ers","PHI","1990s","PG",12.4,2.4,5.4,1.4,0.2],
  ["Ron Anderson","Philadelphia 76ers","PHI","1990s","SF|SG",14.4,4.4,2.4,1.0,0.3],
  ["Tim Perry","Philadelphia 76ers","PHI","1990s","SF|PF",8.4,5.4,1.4,0.8,0.8],
  ["Manute Bol","Philadelphia 76ers","PHI","1990s","C",4.4,5.4,0.8,0.4,4.4],
  ["Ben Simmons","Philadelphia 76ers","PHI","2010s","PG|SF",16.4,8.4,7.4,1.8,0.8],
  ["Joel Embiid","Philadelphia 76ers","PHI","2010s","C|PF",24.4,11.4,3.4,0.8,2.4],
  ["Markelle Fultz","Philadelphia 76ers","PHI","2010s","PG",11.4,3.4,5.4,1.2,0.4],
  ["JJ Redick","Philadelphia 76ers","PHI","2010s","SG|SF",17.4,2.4,2.4,0.8,0.2],
  ["Robert Covington","Philadelphia 76ers","PHI","2010s","SF|PF",12.4,5.4,1.8,1.8,1.4],
  ["Dario Saric","Philadelphia 76ers","PHI","2010s","PF|SF",13.4,5.4,2.4,0.8,0.4],
  ["Ersan Ilyasova","Philadelphia 76ers","PHI","2010s","PF|C",11.4,6.4,2.4,0.8,0.6],
  ["Richaun Holmes","Philadelphia 76ers","PHI","2010s","C|PF",10.4,6.4,1.4,0.8,1.8],
  ["Amir Johnson","Philadelphia 76ers","PHI","2010s","PF|C",9.4,6.4,1.8,0.8,1.2],
  ["Jerryd Bayless","Philadelphia 76ers","PHI","2010s","PG|SG",10.4,2.8,4.4,1.0,0.2],
  ["Walter Davis","Phoenix Suns","PHX","1980s","SG|SF",22.4,4.4,3.4,1.4,0.4],
  ["Larry Nance","Phoenix Suns","PHX","1980s","PF|SF",14.4,7.4,2.4,1.4,2.4],
  ["James Edwards","Phoenix Suns","PHX","1980s","C",14.4,5.4,1.4,0.4,1.2],
  ["Paul Westphal","Phoenix Suns","PHX","1980s","PG|SG",16.4,3.4,5.4,1.6,0.3],
  ["Truck Robinson","Phoenix Suns","PHX","1980s","PF|C",14.4,11.4,2.4,0.8,0.6],
  ["Dennis Johnson","Phoenix Suns","PHX","1980s","SG|PG",18.4,4.4,6.4,2.0,0.8],
  ["Alvan Adams","Phoenix Suns","PHX","1980s","C|PF",12.4,7.4,4.4,1.4,0.8],
  ["Kyle Macy","Phoenix Suns","PHX","1980s","PG|SG",10.4,2.8,5.4,1.2,0.2],
  ["Jeff Cook","Phoenix Suns","PHX","1980s","PF|SF",9.4,5.4,2.4,1.0,0.6],
  ["Neal Walk","Phoenix Suns","PHX","1980s","C|PF",11.4,8.4,2.4,0.8,0.8],
  ["Devin Booker","Phoenix Suns","PHX","2010s","SG|PG",24.4,4.4,4.4,0.8,0.3],
  ["Deandre Ayton","Phoenix Suns","PHX","2010s","C|PF",16.4,10.4,1.8,0.8,1.2],
  ["Chris Paul","Phoenix Suns","PHX","2010s","PG",16.4,4.6,8.9,1.6,0.2],
  ["Mikal Bridges","Phoenix Suns","PHX","2010s","SF|SG",13.4,4.4,2.4,1.4,0.6],
  ["Cameron Johnson","Phoenix Suns","PHX","2010s","SF|PF",12.4,4.4,2.4,0.8,0.4],
  ["Jae Crowder","Phoenix Suns","PHX","2010s","SF|PF",9.4,4.4,1.8,1.0,0.4],
  ["Cameron Payne","Phoenix Suns","PHX","2010s","PG",10.4,3.4,4.4,0.8,0.2],
  ["Dario Saric","Phoenix Suns","PHX","2010s","PF|SF",11.4,5.4,2.4,0.8,0.4],
  ["Frank Kaminsky","Phoenix Suns","PHX","2010s","C|PF",9.4,4.4,2.4,0.6,0.6],
  ["E'Twaun Moore","Phoenix Suns","PHX","2010s","SG|SF",8.4,2.8,2.4,0.8,0.2],
  ["Devin Booker","Phoenix Suns","PHX","2020s","SG|PG",27.4,4.4,5.4,0.8,0.3],
  ["Kevin Durant","Phoenix Suns","PHX","2020s","SF|PF",27.4,6.4,5.4,0.8,1.2],
  ["Bradley Beal","Phoenix Suns","PHX","2020s","SG|PG",18.4,4.4,5.4,0.8,0.3],
  ["Deandre Ayton","Phoenix Suns","PHX","2020s","C|PF",17.4,10.4,1.8,0.6,1.0],
  ["Grayson Allen","Phoenix Suns","PHX","2020s","SG|SF",13.4,3.4,2.4,1.0,0.3],
  ["Eric Gordon","Phoenix Suns","PHX","2020s","SG|PG",14.4,2.8,2.8,0.8,0.2],
  ["Royce O'Neale","Phoenix Suns","PHX","2020s","SF|PF",8.4,4.4,2.8,1.2,0.4],
  ["Drew Eubanks","Phoenix Suns","PHX","2020s","C|PF",8.4,6.4,1.4,0.6,0.8],
  ["Nassir Little","Phoenix Suns","PHX","2020s","SF|PF",10.4,5.4,1.8,0.8,0.4],
  ["Damion Lee","Phoenix Suns","PHX","2020s","SG|SF",8.4,2.8,1.8,0.8,0.3],
  ["Damon Stoudamire","Portland Trail Blazers","POR","1990s","PG",17.4,4.4,8.8,1.4,0.2],
  ["Rasheed Wallace","Portland Trail Blazers","POR","1990s","PF|C",16.4,6.4,2.4,1.2,1.8],
  ["Isaiah Rider","Portland Trail Blazers","POR","1990s","SG|SF",18.4,3.4,2.4,1.2,0.3],
  ["Brian Grant","Portland Trail Blazers","POR","1990s","PF|C",11.4,8.4,1.8,0.8,0.8],
  ["Arvydas Sabonis","Portland Trail Blazers","POR","1990s","C",14.4,8.4,3.4,0.8,1.4],
  ["Detlef Schrempf","Portland Trail Blazers","POR","1990s","PF|SF",13.4,6.4,3.4,0.8,0.4],
  ["Bonzi Wells","Portland Trail Blazers","POR","1990s","SG|SF",12.4,5.4,2.4,1.4,0.4],
  ["Kenny Anderson","Portland Trail Blazers","POR","1990s","PG",14.4,3.4,7.4,1.6,0.2],
  ["Stacey Augmon","Portland Trail Blazers","POR","1990s","SG|SF",10.4,4.4,2.4,1.6,0.4],
  ["Gary Trent","Portland Trail Blazers","POR","1990s","SF|SG",12.4,5.4,1.4,0.8,0.4],
  ["Rasheed Wallace","Portland Trail Blazers","POR","2000s","PF|C",18.4,6.4,2.4,1.0,1.8],
  ["Zach Randolph","Portland Trail Blazers","POR","2000s","PF|C",19.4,10.4,2.4,0.8,0.4],
  ["Damon Stoudamire","Portland Trail Blazers","POR","2000s","PG",13.4,3.4,7.4,1.4,0.2],
  ["Derek Anderson","Portland Trail Blazers","POR","2000s","SG|SF",12.4,3.4,3.4,1.2,0.4],
  ["Bonzi Wells","Portland Trail Blazers","POR","2000s","SG|SF",15.4,6.4,3.4,1.4,0.4],
  ["Ruben Patterson","Portland Trail Blazers","POR","2000s","SF|SG",13.4,5.4,2.4,1.4,0.6],
  ["Shareef Abdur-Rahim","Portland Trail Blazers","POR","2000s","PF|SF",16.4,6.4,2.4,0.8,0.6],
  ["Joel Przybilla","Portland Trail Blazers","POR","2000s","C",7.4,9.4,1.4,0.8,2.0],
  ["Travis Outlaw","Portland Trail Blazers","POR","2000s","SF|PF",12.4,4.4,1.4,0.8,0.4],
  ["Steve Francis","Portland Trail Blazers","POR","2000s","PG|SG",12.4,3.4,5.4,1.4,0.4],
  ["Anfernee Simons","Portland Trail Blazers","POR","2020s","SG|PG",24.4,3.4,5.4,1.0,0.3],
  ["Jerami Grant","Portland Trail Blazers","POR","2020s","SF|PF",17.4,4.4,2.4,1.2,0.6],
  ["Jusuf Nurkic","Portland Trail Blazers","POR","2020s","C",15.4,10.4,3.4,0.8,1.2],
  ["Shaedon Sharpe","Portland Trail Blazers","POR","2020s","SG|SF",16.4,3.4,2.4,1.0,0.3],
  ["Scoot Henderson","Portland Trail Blazers","POR","2020s","PG",14.4,4.4,5.4,1.2,0.4],
  ["Toumani Camara","Portland Trail Blazers","POR","2020s","SF|PF",9.4,5.4,2.4,1.4,0.6],
  ["Malcolm Brogdon","Portland Trail Blazers","POR","2020s","PG|SG",14.4,3.4,4.4,0.8,0.3],
  ["Robert Williams III","Portland Trail Blazers","POR","2020s","C",10.4,8.4,1.8,0.8,2.0],
  ["Matisse Thybulle","Portland Trail Blazers","POR","2020s","SG|SF",7.4,3.4,1.8,2.0,1.2],
  ["Jabari Walker","Portland Trail Blazers","POR","2020s","PF|SF",8.4,6.4,2.4,0.8,0.4],
  ["Reggie Theus","Sacramento Kings","SAC","1980s","PG|SG",20.4,3.4,7.4,1.4,0.2],
  ["Eddie Johnson","Sacramento Kings","SAC","1980s","SG|SF",21.4,4.4,3.4,1.0,0.3],
  ["LaSalle Thompson","Sacramento Kings","SAC","1980s","C|PF",10.4,8.4,2.4,0.8,1.8],
  ["Derek Smith","Sacramento Kings","SAC","1980s","SG|SF",18.4,4.4,3.4,1.4,0.4],
  ["Mike Woodson","Sacramento Kings","SAC","1980s","SG|PG",14.4,3.4,3.4,1.2,0.2],
  ["Lester Conner","Sacramento Kings","SAC","1980s","PG|SG",10.4,4.4,5.4,2.2,0.4],
  ["Joe Kleine","Sacramento Kings","SAC","1980s","C",6.4,6.4,1.4,0.6,0.8],
  ["Kenny Smith","Sacramento Kings","SAC","1980s","PG",14.4,3.4,6.4,1.2,0.2],
  ["Rodney McCray","Sacramento Kings","SAC","1980s","SF|PF",12.4,6.4,4.4,1.2,0.6],
  ["Randy Wittman","Sacramento Kings","SAC","1980s","SG|PG",13.4,2.8,3.4,0.8,0.2],
  ["Peja Stojakovic","Sacramento Kings","SAC","2000s","SF|SG",22.4,4.4,2.4,1.0,0.3],
  ["Chris Webber","Sacramento Kings","SAC","2000s","PF|C",24.4,10.4,4.4,1.4,1.4],
  ["Mike Bibby","Sacramento Kings","SAC","2000s","PG",16.4,3.4,5.4,1.2,0.2],
  ["Vlade Divac","Sacramento Kings","SAC","2000s","C",11.4,8.4,3.4,1.0,1.2],
  ["Doug Christie","Sacramento Kings","SAC","2000s","SG|SF",14.4,4.4,3.4,2.4,0.6],
  ["Bobby Jackson","Sacramento Kings","SAC","2000s","PG|SG",15.4,3.4,5.4,1.6,0.2],
  ["Brad Miller","Sacramento Kings","SAC","2000s","C",12.4,9.4,4.4,1.0,1.4],
  ["Gerald Wallace","Sacramento Kings","SAC","2000s","SF|SG",12.4,7.4,2.4,2.0,1.2],
  ["Francisco Garcia","Sacramento Kings","SAC","2000s","SG|SF",12.4,3.4,2.4,1.0,0.4],
  ["Kenny Thomas","Sacramento Kings","SAC","2000s","PF|C",11.4,8.4,1.8,0.8,0.6],
  ["DeMarcus Cousins","Sacramento Kings","SAC","2010s","C|PF",22.4,11.4,3.4,1.4,1.4],
  ["Rudy Gay","Sacramento Kings","SAC","2010s","SF|SG",18.4,5.4,2.8,1.2,0.6],
  ["Isaiah Thomas","Sacramento Kings","SAC","2010s","PG",19.4,2.8,5.4,1.0,0.2],
  ["Ben McLemore","Sacramento Kings","SAC","2010s","SG|SF",12.4,3.4,1.8,0.8,0.3],
  ["Tyreke Evans","Sacramento Kings","SAC","2010s","SG|PG",20.4,5.4,5.4,1.4,0.4],
  ["Omri Casspi","Sacramento Kings","SAC","2010s","SF|PF",9.4,4.4,1.8,0.8,0.4],
  ["Carl Landry","Sacramento Kings","SAC","2010s","PF|C",12.4,6.4,1.4,0.8,0.6],
  ["Jason Thompson","Sacramento Kings","SAC","2010s","PF|C",10.4,7.4,1.8,0.8,0.6],
  ["Aaron Brooks","Sacramento Kings","SAC","2010s","PG",14.4,2.4,4.4,1.0,0.2],
  ["Jimmer Fredette","Sacramento Kings","SAC","2010s","PG|SG",7.4,1.8,2.4,0.6,0.1],
                                                              ["DeMar DeRozan","Toronto Raptors","TOR","2010s","SG|SF",23.4,4.4,3.4,1.4,0.4],
  ["Kyle Lowry","Toronto Raptors","TOR","2010s","PG",18.4,4.4,6.4,1.6,0.4],
  ["Kawhi Leonard","Toronto Raptors","TOR","2010s","SF|PF",26.4,7.4,3.4,1.8,0.4],
  ["Pascal Siakam","Toronto Raptors","TOR","2010s","PF|SF",20.4,7.4,3.4,1.0,0.8],
  ["Jonas Valanciunas","Toronto Raptors","TOR","2010s","C",14.4,9.4,1.8,0.8,1.0],
  ["Fred VanVleet","Toronto Raptors","TOR","2010s","PG",17.4,3.4,6.4,1.8,0.2],
  ["OG Anunoby","Toronto Raptors","TOR","2010s","SF|SG",10.4,5.4,1.8,1.8,1.0],
  ["Marc Gasol","Toronto Raptors","TOR","2010s","C",13.4,7.4,3.4,1.4,1.8],
  ["Norm Powell","Toronto Raptors","TOR","2010s","SG|SF",14.4,3.4,2.4,1.0,0.3],
  ["Serge Ibaka","Toronto Raptors","TOR","2010s","C|PF",14.4,7.4,2.4,0.8,2.4],
  ["Scottie Barnes","Toronto Raptors","TOR","2020s","SF|PF",17.4,7.4,5.4,1.4,1.1],
  ["Pascal Siakam","Toronto Raptors","TOR","2020s","PF|SF",23.4,8.4,5.4,1.2,0.8],
  ["OG Anunoby","Toronto Raptors","TOR","2020s","SF|SG",16.4,5.4,2.4,1.8,1.0],
  ["Fred VanVleet","Toronto Raptors","TOR","2020s","PG",18.4,3.4,7.4,2.0,0.2],
  ["Jakob Poeltl","Toronto Raptors","TOR","2020s","C",14.4,9.4,2.4,0.8,1.8],
  ["Gary Trent Jr.","Toronto Raptors","TOR","2020s","SG|SF",16.4,2.8,1.8,1.0,0.2],
  ["Immanuel Quickley","Toronto Raptors","TOR","2020s","PG|SG",16.4,4.4,5.4,1.2,0.3],
  ["RJ Barrett","Toronto Raptors","TOR","2020s","SG|SF",21.4,5.4,3.4,0.8,0.3],
  ["Gradey Dick","Toronto Raptors","TOR","2020s","SG|SF",12.4,3.4,2.4,0.8,0.3],
  ["Bruce Brown","Toronto Raptors","TOR","2020s","SG|SF",11.4,4.4,3.4,1.0,0.4],
  ["Carlos Boozer","Utah Jazz","UTA","2000s","PF|C",19.4,10.4,2.8,0.8,0.6],
  ["Deron Williams","Utah Jazz","UTA","2000s","PG",19.4,3.4,9.4,1.4,0.2],
  ["Mehmet Okur","Utah Jazz","UTA","2000s","C|PF",14.4,7.4,1.8,0.6,1.0],
  ["Matt Harpring","Utah Jazz","UTA","2000s","SF|SG",14.4,5.4,2.4,1.0,0.4],
  ["Andrei Kirilenko","Utah Jazz","UTA","2000s","SF|PF",12.4,6.4,3.4,1.8,2.2],
  ["Gordon Giricek","Utah Jazz","UTA","2000s","SG|SF",13.4,3.4,2.4,0.8,0.3],
  ["Paul Millsap","Utah Jazz","UTA","2000s","PF|C",10.4,7.4,1.8,1.0,0.8],
  ["Ronnie Price","Utah Jazz","UTA","2000s","PG",6.4,2.4,4.4,1.6,0.2],
  ["Kyle Korver","Utah Jazz","UTA","2000s","SG|SF",9.4,2.8,2.4,0.8,0.4],
  ["Mo Williams","Utah Jazz","UTA","2000s","PG",12.4,3.4,5.4,1.0,0.2],
  ["Gordon Hayward","Utah Jazz","UTA","2010s","SF|SG",18.4,5.4,3.4,1.4,0.4],
  ["Rudy Gobert","Utah Jazz","UTA","2010s","C",12.4,12.4,1.8,0.8,2.4],
  ["Derrick Favors","Utah Jazz","UTA","2010s","PF|C",12.4,8.4,1.4,0.8,1.4],
  ["Donovan Mitchell","Utah Jazz","UTA","2010s","SG|PG",24.4,4.4,4.4,1.4,0.4],
  ["Joe Ingles","Utah Jazz","UTA","2010s","SF|SG",10.4,3.4,3.4,0.8,0.4],
  ["Ricky Rubio","Utah Jazz","UTA","2010s","PG",13.4,4.4,7.4,2.0,0.2],
  ["Royce O'Neale","Utah Jazz","UTA","2010s","SF|PF",9.4,4.4,2.8,1.4,0.4],
  ["Bojan Bogdanovic","Utah Jazz","UTA","2010s","SF|SG",17.4,3.4,2.4,0.8,0.3],
  ["Mike Conley","Utah Jazz","UTA","2010s","PG",15.4,3.4,5.4,1.2,0.2],
  ["Georges Niang","Utah Jazz","UTA","2010s","PF|SF",9.4,3.4,2.4,0.6,0.4],
  ["Lauri Markkanen","Utah Jazz","UTA","2020s","PF|C",23.4,8.4,2.4,0.8,0.8],
  ["Collin Sexton","Utah Jazz","UTA","2020s","PG|SG",18.4,3.4,3.4,1.0,0.2],
  ["Jordan Clarkson","Utah Jazz","UTA","2020s","PG|SG",19.4,3.4,3.4,0.8,0.2],
  ["John Collins","Utah Jazz","UTA","2020s","PF|C",16.4,7.4,2.0,0.8,0.6],
  ["Walker Kessler","Utah Jazz","UTA","2020s","C",11.4,10.4,1.8,0.6,2.8],
  ["Ochai Agbaji","Utah Jazz","UTA","2020s","SG|SF",10.4,3.4,1.8,0.8,0.3],
  ["Talen Horton-Tucker","Utah Jazz","UTA","2020s","SF|SG",12.4,4.4,3.4,1.0,0.4],
  ["Rudy Gay","Utah Jazz","UTA","2020s","SF|PF",10.4,4.4,2.4,0.8,0.4],
  ["Simone Fontecchio","Utah Jazz","UTA","2020s","SF|SG",11.4,3.4,2.0,0.6,0.4],
  ["Kelly Olynyk","Utah Jazz","UTA","2020s","PF|C",9.4,5.4,3.4,0.6,0.6],
  ["Jeff Ruland","Washington Wizards","WAS","1980s","C",15.4,10.4,3.4,0.8,1.4],
  ["Gus Williams","Washington Wizards","WAS","1980s","PG|SG",16.4,3.4,5.4,2.0,0.3],
  ["Frank Johnson","Washington Wizards","WAS","1980s","PG|SG",8.4,2.8,4.8,1.2,0.1],
  ["Cliff Robinson","Washington Wizards","WAS","1980s","SF|PF",12.4,6.4,2.4,1.0,0.6],
  ["Rick Mahorn","Washington Wizards","WAS","1980s","PF|C",10.4,8.4,2.4,0.8,1.0],
  ["Charles Jones","Washington Wizards","WAS","1980s","C|PF",5.4,7.4,1.4,0.6,2.2],
  ["Don Collins","Washington Wizards","WAS","1980s","SG|SF",13.4,3.4,2.4,1.2,0.3],
  ["Darren Daye","Washington Wizards","WAS","1980s","SF|SG",10.4,4.4,2.8,1.0,0.4],
  ["Tom McMillen","Washington Wizards","WAS","1980s","PF|C",9.4,5.4,1.6,0.6,0.6],
  ["Jay Vincent","Washington Wizards","WAS","1980s","SF|PF",14.4,5.4,2.4,1.0,0.4],
  ["Chris Webber","Washington Wizards","WAS","1990s","PF|C",22.4,9.4,4.4,1.4,1.4],
  ["Rod Strickland","Washington Wizards","WAS","1990s","PG",14.4,4.4,8.8,1.8,0.2],
  ["Calbert Cheaney","Washington Wizards","WAS","1990s","SG|SF",15.4,3.4,2.4,1.0,0.3],
  ["Juwan Howard","Washington Wizards","WAS","1990s","PF|C",18.4,8.4,3.4,0.8,0.4],
  ["Ben Wallace","Washington Wizards","WAS","1990s","C|PF",7.4,9.4,1.4,1.2,1.8],
  ["Tracy Murray","Washington Wizards","WAS","1990s","SF|PF",13.4,4.4,1.8,0.8,0.4],
  ["Harvey Grant","Washington Wizards","WAS","1990s","SF|PF",12.4,5.4,2.4,1.2,0.6],
  ["Don MacLean","Washington Wizards","WAS","1990s","PF|SF",12.4,5.4,2.0,0.6,0.4],
  ["Gheorghe Muresan","Washington Wizards","WAS","1990s","C",14.4,9.4,0.8,0.4,1.8],
  ["Tim Legler","Washington Wizards","WAS","1990s","SG",10.4,2.4,2.4,0.8,0.2],
  ["Gilbert Arenas","Washington Wizards","WAS","2000s","PG",26.4,4.4,5.4,1.8,0.4],
  ["Antawn Jamison","Washington Wizards","WAS","2000s","PF|SF",20.4,8.4,2.4,1.0,0.6],
  ["Caron Butler","Washington Wizards","WAS","2000s","SF|SG",18.4,5.4,3.4,1.6,0.4],
  ["Brendan Haywood","Washington Wizards","WAS","2000s","C",8.4,7.4,0.8,0.6,2.0],
  ["Jarvis Hayes","Washington Wizards","WAS","2000s","SG|SF",10.4,3.4,1.8,0.8,0.3],
  ["Etan Thomas","Washington Wizards","WAS","2000s","C|PF",6.4,6.4,0.8,0.6,1.8],
  ["Antonio Daniels","Washington Wizards","WAS","2000s","PG",9.4,2.8,4.4,1.2,0.2],
  ["DeShawn Stevenson","Washington Wizards","WAS","2000s","SG|SF",8.4,3.4,2.0,1.2,0.4],
  ["Awvee Storey","Washington Wizards","WAS","2000s","PG",6.4,2.4,4.4,1.2,0.2],
  ["Michael Ruffin","Washington Wizards","WAS","2000s","PF|C",4.4,5.4,1.4,0.8,0.8],
  ["John Wall","Washington Wizards","WAS","2010s","PG",19.4,4.4,9.4,1.8,0.8],
  ["Bradley Beal","Washington Wizards","WAS","2010s","SG|SF",24.4,4.4,5.4,1.4,0.4],
  ["Marcin Gortat","Washington Wizards","WAS","2010s","C",10.4,9.4,1.4,0.6,1.2],
  ["Otto Porter Jr.","Washington Wizards","WAS","2010s","SF|SG",14.4,5.4,2.4,1.4,0.6],
  ["Markieff Morris","Washington Wizards","WAS","2010s","PF|C",12.4,6.4,2.4,0.8,0.6],
  ["Martell Webster","Washington Wizards","WAS","2010s","SF|SG",9.4,3.4,1.8,0.8,0.4],
  ["Nenê","Washington Wizards","WAS","2010s","C|PF",13.4,7.4,2.4,0.6,1.0],
  ["Al Thornton","Washington Wizards","WAS","2010s","SF|PF",10.4,4.4,1.8,0.8,0.4],
  ["Ramon Sessions","Washington Wizards","WAS","2010s","PG",13.4,3.4,5.4,1.2,0.2],
  ["Kevin Seraphin","Washington Wizards","WAS","2010s","C|PF",9.4,5.4,1.4,0.4,0.8],
  ["Bradley Beal","Washington Wizards","WAS","2020s","SG|SF",22.4,4.4,6.4,1.2,0.4],
  ["Russell Westbrook","Washington Wizards","WAS","2020s","PG",22.4,11.4,11.4,1.4,0.4],
  ["Kyle Kuzma","Washington Wizards","WAS","2020s","PF|SF",21.4,8.4,3.4,0.8,0.6],
  ["Kristaps Porzingis","Washington Wizards","WAS","2020s","C|PF",22.4,8.4,2.4,0.8,1.4],
  ["Spencer Dinwiddie","Washington Wizards","WAS","2020s","PG|SG",15.4,3.4,5.4,0.8,0.3],
  ["Rui Hachimura","Washington Wizards","WAS","2020s","SF|PF",13.4,5.4,1.8,0.6,0.4],
  ["Deni Avdija","Washington Wizards","WAS","2020s","SF|PF",13.4,6.4,4.4,1.0,0.6],
  ["Daniel Gafford","Washington Wizards","WAS","2020s","C",10.4,7.4,1.4,0.8,2.2],
  ["Corey Kispert","Washington Wizards","WAS","2020s","SF|SG",12.4,3.4,2.0,0.6,0.4],
  ["Ish Smith","Washington Wizards","WAS","2020s","PG",9.4,2.8,5.4,1.0,0.2],
  ["Vince Carter","Toronto Raptors","TOR","2000s","SG|SF",23.4,5.4,3.4,1.4,0.6],
  ["Chris Bosh","Toronto Raptors","TOR","2000s","PF|C",20.4,9.4,2.4,0.8,1.0],
  ["Morris Peterson","Toronto Raptors","TOR","2000s","SF|SG",13.4,4.4,2.4,1.0,0.4],
  ["Alvin Williams","Toronto Raptors","TOR","2000s","PG",9.4,3.4,5.4,1.4,0.2],
  ["Jermaine O'Neal","Toronto Raptors","TOR","2000s","PF|C",15.4,8.4,1.8,0.8,1.8],
  ["Jose Calderon","Toronto Raptors","TOR","2000s","PG",9.4,2.8,6.4,1.0,0.2],
  ["Anthony Parker","Toronto Raptors","TOR","2000s","SG|SF",11.4,3.4,2.8,1.0,0.3],
  ["Jorge Garbajosa","Toronto Raptors","TOR","2000s","PF|SF",10.4,5.4,2.4,0.8,0.4],
  ["Joey Graham","Toronto Raptors","TOR","2000s","SF|SG",8.4,4.4,1.8,1.0,0.4],
  ["T.J. Ford","Toronto Raptors","TOR","2000s","PG",14.4,3.4,7.4,1.4,0.2],
  ["Sam Merrill","Cleveland Cavaliers","CLE","2020s","SG|SF",9.4,2.8,1.8,0.8,0.2],
  ["Mamadi Diakite","Cleveland Cavaliers","CLE","2020s","PF|C",6.4,4.4,0.8,0.6,0.8],
  ["Lamar Stevens","Cleveland Cavaliers","CLE","2020s","SF|PF",7.4,3.4,1.4,0.8,0.4],
  ["Lou Williams","Atlanta Hawks","ATL","1990s","SG|PG",12.4,2.4,4.4,1.0,0.2],
  ["Roshown McLeod","Atlanta Hawks","ATL","1990s","SF|PF",8.4,4.4,1.8,0.8,0.4],
  ["Christian Laettner","Atlanta Hawks","ATL","1990s","PF|C",12.4,7.4,2.4,0.8,0.8],
  ["Priest Lauderdale","Atlanta Hawks","ATL","1990s","C",5.4,5.4,0.8,0.4,1.2],
  ["Antoine Walker","Atlanta Hawks","ATL","2000s","PF|SF",16.4,8.4,3.4,1.2,0.6],
  ["Josh Childress","Atlanta Hawks","ATL","2000s","SF|SG",9.4,4.4,2.4,1.0,0.6],
  ["Salim Stoudamire","Atlanta Hawks","ATL","2000s","SG|PG",10.4,2.4,2.8,0.8,0.2],
  ["Royal Ivey","Atlanta Hawks","ATL","2000s","PG|SG",6.4,2.4,3.4,1.2,0.2],
  ["Zaza Pachulia","Atlanta Hawks","ATL","2010s","C",9.4,8.4,1.8,0.6,0.6],
  ["Mike Scott","Atlanta Hawks","ATL","2010s","PF|SF",9.4,4.4,1.4,0.6,0.4],
  ["Dennis Schroder","Atlanta Hawks","ATL","2010s","PG",16.4,3.4,6.4,1.4,0.2],
  ["Walter Tavares","Atlanta Hawks","ATL","2010s","C",5.4,5.4,0.8,0.4,2.2],
  ["Aaron Holiday","Atlanta Hawks","ATL","2020s","PG|SG",8.4,2.4,4.4,1.0,0.2],
  ["Bruno Fernando","Atlanta Hawks","ATL","2020s","C|PF",7.4,6.4,0.8,0.6,0.8],
  ["Danilo Gallinari","Atlanta Hawks","ATL","2020s","SF|PF",11.4,4.4,2.4,0.8,0.4],
  ["Dana Barros","Boston Celtics","BOS","1990s","PG|SG",11.4,2.4,4.4,1.2,0.2],
  ["Pervis Ellison","Boston Celtics","BOS","1990s","C|PF",9.4,7.4,1.4,1.0,1.8],
  ["Dino Radja","Boston Celtics","BOS","1990s","C|PF",15.4,8.4,1.8,0.8,1.2],
  ["David Wesley","Boston Celtics","BOS","1990s","PG|SG",10.4,3.4,4.8,1.4,0.2],
  ["Jrue Holiday","Boston Celtics","BOS","2010s","PG|SG",14.4,4.4,5.4,1.8,0.4],
  ["Robert Williams III","Boston Celtics","BOS","2010s","C",10.4,9.4,1.4,0.8,2.4],
  ["Semi Ojeleye","Boston Celtics","BOS","2010s","SF|PF",6.4,3.4,1.4,0.8,0.4],
  ["Daniel Theis","Boston Celtics","BOS","2010s","C|PF",9.4,6.4,1.8,0.6,1.2],
  ["Kevin Loughery","Brooklyn Nets","BKN","1970s","SG|PG",12.4,3.4,4.4,1.4,0.2],
  ["Super John Williamson","Brooklyn Nets","BKN","1970s","SG",18.4,3.4,3.4,1.6,0.2],
  ["Deron Williams","Brooklyn Nets","BKN","2010s","PG",19.4,3.4,7.4,1.4,0.2],
  ["Joe Johnson","Brooklyn Nets","BKN","1980s","SG|SF",16.4,4.4,3.4,1.0,0.3],
  ["Reggie Evans","Brooklyn Nets","BKN","1980s","PF|C",5.4,9.4,1.4,0.8,0.4],
  ["Gerald Wallace","Brooklyn Nets","BKN","1980s","SF|SG",14.4,7.4,2.8,2.0,1.2],
  ["Andray Blatche","Brooklyn Nets","BKN","1990s","C|PF",12.4,7.4,2.4,0.8,1.0],
  ["Russ Williams","Brooklyn Nets","BKN","1990s","PG|SG",8.4,2.4,4.4,1.2,0.2],
  ["Lucious Harris","Brooklyn Nets","BKN","1990s","SG|SF",9.4,3.4,2.4,1.0,0.3],
  ["Jim McIlvaine","Brooklyn Nets","BKN","1990s","C",4.4,5.4,0.8,0.4,2.2],
  ["Yi Jianlian","Brooklyn Nets","BKN","2000s","PF|C",9.4,5.4,1.4,0.6,0.8],
  ["Hassan Adams","Brooklyn Nets","BKN","2000s","SF|SG",6.4,3.4,1.4,1.0,0.4],
  ["Jason Collins","Brooklyn Nets","BKN","2000s","C",3.4,4.4,0.8,0.4,0.8],
  ["Paul Pierce","Brooklyn Nets","BKN","2010s","SF|PF",13.4,4.4,2.4,0.8,0.4],
  ["Thaddeus Young","Brooklyn Nets","BKN","2010s","PF|SF",14.4,6.4,2.4,1.4,0.4],
  ["Alan Anderson","Brooklyn Nets","BKN","2010s","SG|SF",10.4,3.4,2.4,1.0,0.3],
  ["Mirza Teletovic","Brooklyn Nets","BKN","2010s","PF|SF",10.4,4.4,1.4,0.6,0.4],
  ["Patty Mills","Brooklyn Nets","BKN","2020s","PG|SG",11.4,2.4,2.8,1.0,0.2],
  ["LaMarcus Aldridge","Brooklyn Nets","BKN","2020s","C|PF",12.4,7.8,1.8,0.6,1.0],
  ["Paul Millsap","Brooklyn Nets","BKN","2020s","PF|C",8.4,5.4,1.8,0.8,1.1],
  ["James Johnson","Brooklyn Nets","BKN","2020s","SF|PF",7.4,4.4,2.4,1.0,0.4],
  ["Anthony Mason","Charlotte Hornets","CHA","1990s","PF|SF",14.4,9.4,3.4,1.2,0.6],
  ["Ricky Davis","Charlotte Hornets","CHA","2000s","SG|SF",14.4,3.4,3.4,1.2,0.3],
  ["Walter Hermann","Charlotte Hornets","CHA","2000s","SF|PF",7.4,4.4,1.8,0.8,0.4],
  ["Sean May","Charlotte Hornets","CHA","2000s","PF|C",8.4,6.4,1.4,0.6,0.6],
  ["Augustin DJ","Charlotte Hornets","CHA","2000s","PG",10.4,2.4,5.4,1.0,0.2],
  ["Brian Roberts","Charlotte Hornets","CHA","2010s","PG|SG",9.4,2.4,4.4,1.0,0.2],
  ["Spencer Hawes","Charlotte Hornets","CHA","2010s","C|PF",10.4,7.4,3.4,0.6,0.8],
  ["Ramon Sessions","Charlotte Hornets","CHA","2010s","PG",11.4,3.4,6.4,1.2,0.2],
  ["Roy Williams","Charlotte Hornets","CHA","2010s","PG|SG",8.4,2.4,5.4,1.0,0.2],
  ["Malik Monk","Charlotte Hornets","CHA","2020s","SG|PG",13.4,2.8,2.8,0.8,0.2],
  ["Montrezl Harrell","Charlotte Hornets","CHA","2020s","C|PF",11.4,6.4,1.4,0.8,0.6],
  ["Isaiah Thomas","Charlotte Hornets","CHA","2020s","PG",12.4,2.8,4.4,0.8,0.2],
  ["Theo Maledon","Charlotte Hornets","CHA","2020s","PG|SG",7.4,2.8,3.4,0.8,0.2],
  ["Bostjan Nachbar","New Orleans Pelicans","NOP","2000s","SF|SG",8.4,3.4,1.8,0.6,0.3],
  ["Chris Andersen","New Orleans Pelicans","NOP","2000s","C|PF",5.4,5.4,0.8,0.8,1.8],
  ["Jamaal Magloire","New Orleans Pelicans","NOP","2000s","C",11.4,9.4,1.4,0.6,0.8],
  ["Speedy Claxton","New Orleans Pelicans","NOP","2000s","PG",9.4,2.8,5.4,1.6,0.2],
  ["Wilbur Holland","Chicago Bulls","CHI","1970s","SG|PG",14.4,2.8,3.4,1.4,0.2],
  ["John Mengelt","Chicago Bulls","CHI","1970s","SG|PG",11.4,2.4,2.8,1.2,0.2],
  ["Clifford Ray","Chicago Bulls","CHI","1970s","C",8.4,9.4,2.4,0.8,1.2],
  ["Matt Guokas","Chicago Bulls","CHI","1970s","PG|SG",8.4,2.8,4.4,1.2,0.2],
  ["Eddy Curry","Chicago Bulls","CHI","2000s","C",11.4,5.4,1.4,0.4,0.8],
  ["Jalen Rose","Chicago Bulls","CHI","2000s","SF|SG",14.4,4.4,3.4,1.0,0.3],
  ["Antonio Davis","Chicago Bulls","CHI","2000s","C|PF",9.4,7.4,1.4,0.6,0.8],
  ["Fred Hoiberg","Chicago Bulls","CHI","2000s","SG|SF",7.4,2.4,2.4,0.6,0.2],
  ["Tony Snell","Chicago Bulls","CHI","2010s","SG|SF",7.4,2.8,1.8,0.8,0.3],
  ["Pau Gasol","Chicago Bulls","CHI","2010s","C|PF",16.4,11.4,4.4,0.6,1.6],
  ["Robin Lopez","Chicago Bulls","CHI","2010s","C",10.4,7.4,1.4,0.4,1.2],
  ["Doug McDermott","Chicago Bulls","CHI","2010s","SF|SG",10.4,3.4,1.4,0.6,0.3],
  ["Javonte Green","Chicago Bulls","CHI","2020s","SF|SG",7.4,3.4,1.4,1.0,0.4],
  ["Derrick Jones Jr.","Chicago Bulls","CHI","2020s","SF|PF",7.4,4.4,1.4,1.0,1.2],
  ["Nikola Mirotic","Chicago Bulls","CHI","2020s","PF|SF",11.4,5.4,1.8,0.6,0.4],
  ["Tony Bradley","Chicago Bulls","CHI","2020s","C",6.4,5.4,0.8,0.4,0.8],
  ["Jim Brewer","Cleveland Cavaliers","CLE","1970s","PF|C",8.4,7.4,2.4,0.8,0.8],
  ["Elmore Smith","Cleveland Cavaliers","CLE","1970s","C",12.4,10.4,1.4,0.8,3.4],
  ["Barry Clemens","Cleveland Cavaliers","CLE","1970s","SF|SG",10.4,4.4,2.4,1.2,0.4],
  ["Rowland Garrett","Cleveland Cavaliers","CLE","1970s","SF|SG",8.4,4.4,2.4,1.2,0.4],
  ["Keith Lee","Cleveland Cavaliers","CLE","1980s","PF|C",8.4,6.4,1.8,0.6,0.8],
  ["Ben Poquette","Cleveland Cavaliers","CLE","1980s","PF|C",7.4,5.4,1.4,0.6,0.8],
  ["Ron Anderson","Cleveland Cavaliers","CLE","1980s","SF|SG",12.4,4.4,2.4,1.0,0.3],
  ["Mel Turpin","Cleveland Cavaliers","CLE","1980s","C",9.4,5.4,1.4,0.4,1.0],
  ["Chris Mills","Cleveland Cavaliers","CLE","1990s","SF|PF",12.4,5.4,2.4,1.0,0.4],
  ["Vitaly Potapenko","Cleveland Cavaliers","CLE","1990s","C|PF",8.4,5.4,1.4,0.4,0.6],
  ["Zydrunas Ilgauskas","Cleveland Cavaliers","CLE","1990s","C",13.4,8.4,1.4,0.6,1.8],
  ["Bob Sura","Cleveland Cavaliers","CLE","1990s","SG|PG",10.4,3.4,4.4,1.2,0.3],
  ["Uwe Blab","Dallas Mavericks","DAL","1980s","C",5.4,4.4,1.4,0.4,0.8],
  ["Herb Williams","Dallas Mavericks","DAL","1980s","C|PF",13.4,7.4,1.8,0.8,1.8],
  ["Jason Kidd","Dallas Mavericks","DAL","1990s","PG",16.6,5.4,7.7,2.4,0.4],
  ["Erick Strickland","Dallas Mavericks","DAL","1990s","SG|PG",12.4,3.4,3.4,1.4,0.3],
  ["Chris Gatling","Dallas Mavericks","DAL","1990s","PF|C",12.4,7.4,1.4,0.8,0.8],
  ["Lorenzo Williams","Dallas Mavericks","DAL","1990s","C|PF",5.4,6.4,1.4,0.8,1.4],
  ["Fat Lever","Denver Nuggets","DEN","1980s","PG|SG",18.4,8.4,7.4,2.8,0.4],
  ["Dan Issel","Denver Nuggets","DEN","1980s","C|PF",17.4,7.4,2.4,0.8,0.6],
  ["Calvin Natt","Denver Nuggets","DEN","1980s","SF|PF",15.4,5.4,2.4,1.0,0.4],
  ["Mahmoud Abdul-Rauf","Denver Nuggets","DEN","1990s","PG",15.4,2.4,4.4,1.0,0.2],
  ["David Wingate","Denver Nuggets","DEN","1990s","SG|SF",8.4,3.4,2.8,1.4,0.3],
  ["Jalen Rose","Denver Nuggets","DEN","1990s","SF|SG",13.4,4.4,3.4,1.0,0.3],
  ["Dean Garrett","Denver Nuggets","DEN","1990s","C",6.4,5.4,1.0,0.5,1.2],
  ["Arron Afflalo","Denver Nuggets","DEN","2010s","SG|SF",15.4,3.4,2.4,0.8,0.3],
  ["Nene","Denver Nuggets","DEN","2010s","C|PF",14.4,7.4,2.4,0.8,1.2],
  ["Andre Iguodala","Denver Nuggets","DEN","2010s","SG|SF",12.4,5.4,4.4,1.8,0.6],
  ["J.J. Hickson","Denver Nuggets","DEN","2010s","PF|C",10.4,8.4,1.4,0.6,0.6],
  ["Stacey Augmon","Detroit Pistons","DET","1990s","SG|SF",10.4,4.4,2.4,1.8,0.4],
  ["Michael Curry","Detroit Pistons","DET","1990s","SG|SF",7.4,2.8,2.4,1.0,0.2],
  ["Bison Dele","Detroit Pistons","DET","1990s","C|PF",12.4,7.4,1.4,0.8,1.4],
  ["Kentavious Caldwell-Pope","Detroit Pistons","DET","2010s","SG|SF",13.4,3.4,2.4,1.2,0.3],
  ["Marcus Morris","Detroit Pistons","DET","2010s","PF|SF",13.4,5.4,1.8,0.8,0.4],
  ["Jon Leuer","Detroit Pistons","DET","2010s","PF|C",9.4,5.4,1.4,0.6,0.6],
  ["Jodie Meeks","Detroit Pistons","DET","2010s","SG|SF",10.4,2.4,1.8,0.8,0.2],
  ["Saddiq Bey","Detroit Pistons","DET","2020s","SF|SG",14.4,4.8,2.4,0.8,0.4],
  ["Frank Jackson","Detroit Pistons","DET","2020s","SG|PG",10.4,2.4,2.8,0.8,0.2],
  ["Hamidou Diallo","Detroit Pistons","DET","2020s","SG|SF",10.4,4.4,1.8,1.0,0.4],
  ["Isaiah Livers","Detroit Pistons","DET","2020s","SF|SG",7.4,3.4,1.4,0.8,0.3],
  ["Mike Smrek","Golden State Warriors","GSW","1980s","C",5.4,4.4,0.8,0.4,0.8],
  ["Tellis Frank","Golden State Warriors","GSW","1980s","PF|C",7.4,5.4,1.4,0.6,0.6],
  ["Steve Harris","Golden State Warriors","GSW","1980s","SG|SF",10.4,3.4,2.4,1.0,0.3],
  ["Ralph Sampson","Golden State Warriors","GSW","1980s","C|PF",14.4,9.4,2.4,1.0,2.4],
  ["Chris Webber","Golden State Warriors","GSW","1990s","PF|C",17.4,8.4,3.4,1.4,1.8],
  ["Billy Owens","Golden State Warriors","GSW","1990s","SF|PF",14.4,7.4,4.4,1.4,0.8],
  ["Rony Seikaly","Golden State Warriors","GSW","1990s","C|PF",13.4,9.4,1.8,0.8,1.4],
  ["Bimbo Coles","Golden State Warriors","GSW","1990s","PG",10.4,3.4,5.4,1.6,0.2],
  ["Nick Van Exel","Golden State Warriors","GSW","2000s","PG",14.4,3.4,6.4,1.0,0.2],
  ["Troy Murphy","Golden State Warriors","GSW","2000s","PF|C",13.4,9.4,2.4,0.8,0.6],
  ["Erick Dampier","Golden State Warriors","GSW","2000s","C",8.4,9.4,1.4,0.6,1.4],
  ["Speedy Claxton","Golden State Warriors","GSW","2000s","PG",10.4,2.8,5.4,1.6,0.2],
  ["David Wesley","Houston Rockets","HOU","2000s","PG|SG",9.4,2.8,4.4,1.2,0.2],
  ["Dikembe Mutombo","Houston Rockets","HOU","2000s","C",7.4,9.4,1.4,0.4,2.8],
  ["Juwan Howard","Houston Rockets","HOU","2000s","PF|C",11.4,6.4,2.4,0.6,0.4],
  ["Stromile Swift","Houston Rockets","HOU","2000s","PF|C",10.4,5.4,1.4,0.8,1.6],
  ["Eric Gordon","Houston Rockets","HOU","2020s","SG|PG",14.4,2.8,2.8,0.8,0.2],
  ["Usman Garuba","Houston Rockets","HOU","2020s","PF|C",5.4,4.4,1.4,0.8,0.6],
  ["Josh Christopher","Houston Rockets","HOU","2020s","SG|SF",9.4,3.4,2.4,1.0,0.3],
  ["Kenyon Martin Jr.","Houston Rockets","HOU","2020s","SF|SG",10.4,4.4,1.8,1.0,0.4],
  ["LaSalle Thompson","Indiana Pacers","IND","1980s","C|PF",9.4,7.4,2.4,0.8,1.4],
  ["Jim Thomas","Indiana Pacers","IND","1980s","SG|SF",8.4,3.4,3.4,1.4,0.3],
  ["Randy Wittman","Indiana Pacers","IND","1980s","SG|PG",11.4,2.8,3.4,0.8,0.2],
  ["Terence Stansbury","Indiana Pacers","IND","1980s","SG|SF",10.4,2.8,2.4,1.0,0.2],
  ["Austin Croshere","Indiana Pacers","IND","2000s","PF|SF",10.4,5.4,1.8,0.8,0.6],
  ["Brad Miller","Indiana Pacers","IND","2000s","C",11.4,8.4,3.4,1.0,1.2],
  ["Erick Dampier","Indiana Pacers","IND","2000s","C",8.4,9.4,1.4,0.6,1.4],
  ["Ian Mahinmi","Indiana Pacers","IND","2010s","C",8.4,6.4,1.4,0.6,1.2],
  ["C.J. Miles","Indiana Pacers","IND","2010s","SF|SG",10.4,3.4,1.8,0.8,0.3],
  ["Solomon Hill","Indiana Pacers","IND","2010s","SF|PF",7.4,4.4,2.4,1.0,0.4],
  ["Zelmo Beaty","Los Angeles Clippers","LAC","1960s","C|PF",16.4,12.4,1.8,0.8,1.0],
  ["Jim Barnes","Los Angeles Clippers","LAC","1960s","PF|C",10.4,8.4,1.8,0.9,0.8],
  ["Clem Haskins","Los Angeles Clippers","LAC","1960s","SG|PG",14.4,4.4,4.4,1.4,0.2],
  ["Dave Stallworth","Los Angeles Clippers","LAC","1960s","SF|PF",12.4,5.4,2.4,1.2,0.4],
  ["Bill Walton","Los Angeles Clippers","LAC","1980s","C",10.4,8.4,2.4,1.0,1.8],
  ["Junior Bridgeman","Los Angeles Clippers","LAC","1980s","SG|SF",12.4,3.4,2.8,0.8,0.2],
  ["Cedric Maxwell","Los Angeles Clippers","LAC","1980s","SF|PF",12.4,6.4,2.8,1.0,0.6],
  ["World B. Free","Los Angeles Clippers","LAC","1980s","SG|PG",20.4,3.4,4.4,1.4,0.2],
  ["Harold Miner","Los Angeles Clippers","LAC","1990s","SG",12.4,2.4,1.8,0.8,0.2],
  ["Stanley Roberts","Los Angeles Clippers","LAC","1990s","C",10.4,7.4,1.4,0.6,2.0],
  ["Terry Dehere","Los Angeles Clippers","LAC","1990s","SG|PG",10.4,2.4,3.4,1.0,0.2],
  ["Keyon Dooling","Los Angeles Clippers","LAC","2000s","PG|SG",8.4,2.4,3.4,1.0,0.2],
  ["Melvin Ely","Los Angeles Clippers","LAC","2000s","C|PF",7.4,5.4,0.8,0.5,0.8],
  ["James Posey","Los Angeles Clippers","LAC","2000s","SF|PF",9.4,4.4,2.4,1.4,0.4],
  ["Danny Granger","Los Angeles Clippers","LAC","2010s","SF|SG",10.4,3.4,1.8,0.8,0.4],
  ["Glen Davis","Los Angeles Clippers","LAC","2010s","PF|C",11.4,6.4,1.8,0.6,0.6],
  ["Hedo Turkoglu","Los Angeles Clippers","LAC","2010s","SF|PF",9.4,4.4,3.4,0.8,0.4],
  ["Willie Green","Los Angeles Clippers","LAC","2010s","SG|SF",9.4,2.4,2.4,1.0,0.2],
  ["Eric Bledsoe","Los Angeles Clippers","LAC","2020s","PG|SG",12.4,3.4,4.4,1.4,0.3],
  ["Robert Covington","Los Angeles Clippers","LAC","2020s","SF|PF",9.4,5.4,1.8,1.6,1.0],
  ["Luke Kennard","Los Angeles Clippers","LAC","2020s","SG|SF",13.4,2.8,2.4,0.8,0.2],
  ["John Wall","Los Angeles Clippers","LAC","2020s","PG",11.4,3.4,6.4,1.2,0.4],
  ["A.C. Green","Los Angeles Lakers","LAL","1990s","PF|SF",7.4,7.4,1.4,0.8,0.4],
  ["D'Angelo Russell","Los Angeles Lakers","LAL","2010s","PG|SG",15.4,3.4,5.4,1.2,0.2],
  ["Larry Nance Jr.","Los Angeles Lakers","LAL","2010s","PF|C",8.4,6.4,2.4,1.2,1.2],
  ["Damon Stoudamire","Memphis Grizzlies","MEM","2000s","PG",13.4,3.4,7.4,1.4,0.2],
  ["Vince Carter","Memphis Grizzlies","MEM","2010s","SG|SF",12.4,3.4,2.4,0.8,0.4],
  ["Courtney Lee","Memphis Grizzlies","MEM","2010s","SG|SF",11.4,3.4,2.4,1.0,0.3],
  ["Kosta Koufos","Memphis Grizzlies","MEM","2010s","C",7.4,7.4,1.4,0.6,1.0],
  ["Lance Stephenson","Memphis Grizzlies","MEM","2010s","SG|SF",11.4,5.4,4.4,1.8,0.4],
  ["De'Anthony Melton","Memphis Grizzlies","MEM","2020s","SG|PG",10.4,3.4,3.4,1.8,0.4],
  ["Brandon Clarke","Memphis Grizzlies","MEM","2020s","PF|C",12.4,5.4,1.4,0.6,1.2],
  ["Kyle Anderson","Memphis Grizzlies","MEM","2020s","SF|PF",9.4,5.4,3.4,1.2,0.6],
  ["Killian Tillie","Memphis Grizzlies","MEM","2020s","PF|C",6.4,4.4,1.4,0.6,0.6],
  ["Alonzo Mourning","Miami Heat","MIA","1990s","C",21.4,10.4,1.8,1.0,3.2],
  ["Jamal Mashburn","Miami Heat","MIA","1990s","SF|PF",20.4,5.4,3.4,1.2,0.6],
  ["Flynn Robinson","Milwaukee Bucks","MIL","1960s","SG|PG",17.4,3.4,3.8,1.4,0.2],
  ["Guy Rodgers","Milwaukee Bucks","MIL","1960s","PG",9.4,3.4,7.4,1.4,0.1],
  ["Junior Bridgeman","Milwaukee Bucks","MIL","1980s","SG|SF",14.4,3.4,2.8,0.8,0.3],
  ["Bob Boozer","Milwaukee Bucks","MIL","1980s","PF|C",10.4,7.4,1.8,0.8,0.8],
  ["Harvey Catchings","Milwaukee Bucks","MIL","1980s","C|PF",7.4,7.4,1.8,0.8,2.0],
  ["Kent Benson","Milwaukee Bucks","MIL","1980s","C|PF",10.4,6.4,2.4,0.8,0.8],
  ["Keith Van Horn","Milwaukee Bucks","MIL","2000s","PF|SF",14.4,6.4,2.4,0.8,0.6],
  ["Vin Baker","Milwaukee Bucks","MIL","2000s","PF|C",12.4,7.4,2.4,0.8,0.8],
  ["Damon Jones","Milwaukee Bucks","MIL","2000s","PG|SG",8.4,2.4,4.4,0.8,0.2],
  ["Dan Gadzuric","Milwaukee Bucks","MIL","2000s","C",6.4,6.4,0.8,0.6,1.4],
  ["Micheal Williams","Minnesota Timberwolves","MIN","1990s","PG",12.4,3.4,7.4,1.8,0.2],
  ["Luc Longley","Minnesota Timberwolves","MIN","1990s","C",9.4,5.4,2.4,0.6,1.0],
  ["Nikola Pekovic","Minnesota Timberwolves","MIN","2010s","C",14.4,8.4,1.4,0.6,0.8],
  ["Corey Brewer","Minnesota Timberwolves","MIN","2010s","SF|SG",10.4,4.4,2.4,1.8,0.4],
  ["Chase Budinger","Minnesota Timberwolves","MIN","2010s","SF|SG",10.4,3.4,1.8,0.8,0.3],
  ["Kurt Thomas","New York Knicks","NYK","2000s","PF|C",10.4,8.4,1.8,0.8,0.8],
  ["Latrell Sprewell","New York Knicks","NYK","2000s","SG|SF",18.4,4.4,4.4,2.0,0.6],
  ["Kenyon Martin","New York Knicks","NYK","2010s","PF|C",9.4,5.4,1.4,0.8,1.2],
  ["Pablo Prigioni","New York Knicks","NYK","2010s","PG",6.4,2.4,4.4,1.4,0.2],
  ["Cole Aldrich","New York Knicks","NYK","2010s","C",7.4,6.4,1.4,0.4,0.8],
  ["Derrick Rose","New York Knicks","NYK","2020s","PG",14.4,3.4,4.4,0.8,0.2],
  ["Nerlens Noel","New York Knicks","NYK","2020s","C",6.4,6.4,1.4,1.0,1.8],
  ["Alec Burks","New York Knicks","NYK","2020s","SG|SF",14.4,4.4,3.4,1.0,0.3],
  ["Evan Fournier","New York Knicks","NYK","2020s","SG|SF",14.4,3.4,2.4,0.6,0.2],
  ["Serge Ibaka","Orlando Magic","ORL","2010s","C|PF",15.4,7.4,1.8,0.8,2.4],
  ["Jeff Green","Orlando Magic","ORL","2010s","SF|PF",11.4,4.4,2.4,0.8,0.6],
  ["Mario Hezonja","Orlando Magic","ORL","2010s","SF|SG",8.4,3.4,1.8,0.8,0.4],
  ["Cole Anthony","Orlando Magic","ORL","2020s","PG|SG",14.4,5.4,5.4,1.0,0.3],
  ["Mo Bamba","Orlando Magic","ORL","2020s","C",10.4,8.4,1.4,0.8,2.4],
  ["R.J. Hampton","Orlando Magic","ORL","2020s","SG|PG",8.4,3.4,3.4,0.8,0.3],
  ["Terrence Ross","Orlando Magic","ORL","2020s","SG|SF",11.4,3.4,2.4,0.8,0.4],
  ["Shawn Bradley","Philadelphia 76ers","PHI","1990s","C",9.4,6.4,1.4,0.4,3.4],
  ["Vernon Maxwell","Philadelphia 76ers","PHI","1990s","SG|PG",14.4,3.4,4.4,1.8,0.3],
  ["Tobias Harris","Philadelphia 76ers","PHI","2010s","SF|PF",20.4,7.4,3.4,0.8,0.4],
  ["Al Horford","Philadelphia 76ers","PHI","2010s","C|PF",14.4,6.8,4.8,1.0,1.2],
  ["Josh Richardson","Philadelphia 76ers","PHI","2010s","SG|SF",13.4,3.4,3.4,1.4,0.4],
  ["Mike Scott","Philadelphia 76ers","PHI","2010s","PF|SF",9.4,4.4,1.4,0.6,0.4],
  ["Kevin Johnson","Phoenix Suns","PHX","1980s","PG",20.4,3.8,12.4,2.0,0.4],
  ["Tom Chambers","Phoenix Suns","PHX","1980s","PF|C",22.4,6.4,2.4,1.0,0.6],
  ["Dan Majerle","Phoenix Suns","PHX","1980s","SG|SF",14.4,4.4,3.4,1.8,0.4],
  ["Mark West","Phoenix Suns","PHX","1980s","C",7.4,6.4,0.8,0.6,1.6],
  ["Goran Dragic","Phoenix Suns","PHX","2010s","PG",18.4,3.4,6.4,1.4,0.2],
  ["Eric Bledsoe","Phoenix Suns","PHX","2010s","PG|SG",18.4,4.4,6.4,1.8,0.4],
  ["Marcus Morris","Phoenix Suns","PHX","2010s","PF|SF",14.4,5.4,1.8,0.8,0.4],
  ["Tyson Chandler","Phoenix Suns","PHX","2010s","C",8.4,10.4,1.4,0.6,1.2],
  ["Chris Paul","Phoenix Suns","PHX","2020s","PG",15.8,4.5,8.9,1.4,0.2],
  ["Mikal Bridges","Phoenix Suns","PHX","2020s","SF|SG",14.4,4.4,2.4,1.4,0.6],
  ["Cam Johnson","Phoenix Suns","PHX","2020s","SF|PF",14.4,4.4,2.4,0.8,0.4],
  ["Bismack Biyombo","Phoenix Suns","PHX","2020s","C",6.4,7.4,1.4,0.6,1.4],
  ["Cliff Robinson","Portland Trail Blazers","POR","1990s","SF|PF",16.4,5.4,2.4,1.2,1.0],
  ["Rod Strickland","Portland Trail Blazers","POR","1990s","PG",17.4,4.4,8.4,1.8,0.2],
  ["Buck Williams","Portland Trail Blazers","POR","1990s","PF|C",10.4,9.4,1.8,0.8,0.6],
  ["Terry Porter","Portland Trail Blazers","POR","1990s","PG",14.4,3.4,6.4,1.4,0.2],
  ["CJ McCollum","Portland Trail Blazers","POR","2020s","SG|PG",23.4,4.4,4.4,1.0,0.3],
  ["Damian Lillard","Portland Trail Blazers","POR","2020s","PG",28.4,4.4,7.4,0.8,0.3],
  ["Nassir Little","Portland Trail Blazers","POR","2020s","SF|PF",10.4,5.4,1.8,0.8,0.4],
  ["Justise Winslow","Portland Trail Blazers","POR","2020s","SF|SG",9.4,5.4,3.4,1.2,0.6],
  ["Otis Thorpe","Sacramento Kings","SAC","1980s","PF|C",14.4,8.4,2.4,0.8,0.6],
  ["Mitch Richmond","Sacramento Kings","SAC","1980s","SG",22.4,4.4,3.4,1.4,0.3],
  ["Harold Pressley","Sacramento Kings","SAC","1980s","SF|SG",9.4,4.4,2.4,1.2,0.4],
  ["Hedo Turkoglu","Sacramento Kings","SAC","2000s","SF|PF",11.4,5.4,3.4,1.0,0.4],
  ["Predrag Stojakovic","Sacramento Kings","SAC","2000s","SF|SG",20.4,4.4,2.4,1.0,0.3],
  ["Jason Williams","Sacramento Kings","SAC","2000s","PG",12.4,3.4,6.4,1.4,0.2],
  ["Rajon Rondo","Sacramento Kings","SAC","2010s","PG",11.4,5.4,9.4,1.8,0.2],
  ["Kosta Koufos","Sacramento Kings","SAC","2010s","C",8.4,7.4,1.4,0.6,1.0],
  ["Matt Barnes","Sacramento Kings","SAC","2010s","SF|PF",9.4,5.4,2.4,1.4,0.6],
  ["Raja Bell","Utah Jazz","UTA","2000s","SG|SF",11.4,3.4,2.4,1.4,0.3],
  ["Donovan Mitchell","Utah Jazz","UTA","2020s","SG|PG",26.4,4.4,4.4,1.4,0.4],
  ["Rudy Gobert","Utah Jazz","UTA","2020s","C",15.4,14.4,1.8,0.8,2.4],
  ["Mike Conley","Utah Jazz","UTA","2020s","PG",14.4,3.4,5.4,1.2,0.2],
  ["Ricky Davis","Charlotte Hornets","CHA","1990s","SG|SF",10.4,3.4,2.8,1.0,0.3],
  ["Derek Fisher","Los Angeles Lakers","LAL","1990s","PG",8.4,2.4,3.4,0.8,0.2],
  ["Rick Fox","Los Angeles Lakers","LAL","1990s","SF|SG",10.4,4.8,3.4,1.2,0.6],
  ["Udonis Haslem","Miami Heat","MIA","2020s","PF|C",4.4,5.4,0.8,0.4,0.4],
  ["Kirk Snyder","Utah Jazz","UTA","2000s","SG|SF",8.4,3.4,2.4,1.0,0.3],
  ["Enes Kanter","Utah Jazz","UTA","2010s","C|PF",12.4,8.4,1.4,0.6,0.6],
  ["Trey Burke","Utah Jazz","UTA","2010s","PG",12.4,2.4,4.4,0.8,0.2],

];

// Expand compressed player data into full objects
const PLAYERS = PLAYERS_RAW.map((p, i) => ({
  id: i + 1,
  name: p[0],
  team: p[1],
  teamShort: p[2],
  decade: p[3],
  positions: p[4].split("|"),
  ppg: p[5], rpg: p[6], apg: p[7], spg: p[8], bpg: p[9]
}));

const ALL_POSITIONS = ["PG","SG","SF","PF","C"];
const POS_COLORS = { PG:"#f4a426", SG:"#60a5fa", SF:"#4ade80", PF:"#a78bfa", C:"#fb923c" };

function getDecades() { return [...new Set(PLAYERS.map(p=>p.decade))].sort(); }
function getTeamsForDecade(decade) { return [...new Set(PLAYERS.filter(p=>p.decade===decade).map(p=>p.team))].filter(t=>!INVALID_COMBOS.has(t+"|"+decade)).sort(); }
function getPlayersForSlot(team, decade) { return PLAYERS.filter(p=>p.team===team && p.decade===decade); }

const INVALID_COMBOS = new Set([
  "Miami Heat|1960s","Miami Heat|1970s","Miami Heat|1980s",
  "Orlando Magic|1960s","Orlando Magic|1970s","Orlando Magic|1980s",
  "Minnesota Timberwolves|1960s","Minnesota Timberwolves|1970s","Minnesota Timberwolves|1980s",
  "Charlotte Hornets|1960s","Charlotte Hornets|1970s","Charlotte Hornets|1980s",
  "Toronto Raptors|1960s","Toronto Raptors|1970s","Toronto Raptors|1980s","Toronto Raptors|1990s",
  "Memphis Grizzlies|1960s","Memphis Grizzlies|1970s","Memphis Grizzlies|1980s","Memphis Grizzlies|1990s",
  "Brooklyn Nets|1960s",
  "Dallas Mavericks|1960s","Dallas Mavericks|1970s",
  "Denver Nuggets|1960s",
  "Indiana Pacers|1960s",
  "New Orleans Pelicans|1960s","New Orleans Pelicans|1970s","New Orleans Pelicans|1980s","New Orleans Pelicans|1990s",
  "Cleveland Cavaliers|1960s","Portland Trail Blazers|1960s","San Antonio Spurs|1960s","Utah Jazz|1960s",
]);

const RARE_FRANCHISES = new Set(["Boston Celtics|1960s","Golden State Warriors|1960s",
  "Sacramento Kings|1960s","Los Angeles Lakers|1960s","Philadelphia 76ers|1960s",
  "Milwaukee Bucks|1970s","Sacramento Kings|1970s",
  "Los Angeles Lakers|1980s","Boston Celtics|1980s",
  "Chicago Bulls|1990s","Houston Rockets|1990s",
  "Los Angeles Lakers|2000s","Cleveland Cavaliers|2000s","San Antonio Spurs|2000s",
  "Golden State Warriors|2010s","Miami Heat|2010s","Oklahoma City Thunder|2010s",
  "San Antonio Spurs|2010s","Cleveland Cavaliers|2010s",
  "Golden State Warriors|2020s","Dallas Mavericks|2020s","Denver Nuggets|2020s",
  "Milwaukee Bucks|2020s","Boston Celtics|2020s",
  "Chicago Bulls|1980s",
  "Los Angeles Lakers|1990s",
  "Milwaukee Bucks|1960s"
]);

const UNCOMMON_FRANCHISES = new Set(["Washington Wizards|1960s",
  "Los Angeles Lakers|1970s","Philadelphia 76ers|1970s","Golden State Warriors|1970s",
  "Portland Trail Blazers|1970s","New York Knicks|1970s","Washington Wizards|1970s",
  "Detroit Pistons|1980s","Philadelphia 76ers|1980s","Houston Rockets|1980s",
  "Utah Jazz|1980s","Portland Trail Blazers|1980s",
  "San Antonio Spurs|1990s","San Antonio Spurs|2020s","San Antonio Spurs|1980s","Utah Jazz|1990s","Phoenix Suns|1990s",
  "Oklahoma City Thunder|1990s","Orlando Magic|1990s","New York Knicks|1990s",
  "Detroit Pistons|2000s","Phoenix Suns|2000s","Dallas Mavericks|2000s","Miami Heat|2000s",
  "Minnesota Timberwolves|2000s","Boston Celtics|2000s","Philadelphia 76ers|2000s",
  "Houston Rockets|2010s","New Orleans Pelicans|2010s","Portland Trail Blazers|2010s","Dallas Mavericks|2010s",
  "Los Angeles Lakers|2020s","Oklahoma City Thunder|2020s","Philadelphia 76ers|2020s",
  "Minnesota Timberwolves|2020s",
  "Milwaukee Bucks|2010s",
  "Atlanta Hawks|1980s",
  "Atlanta Hawks|1990s",
  "Brooklyn Nets|2010s",
  "Brooklyn Nets|2020s",
  "Denver Nuggets|2000s",
  "Houston Rockets|1960s",
  "Minnesota Timberwolves|1990s",
  "Phoenix Suns|2010s",
  "Phoenix Suns|2020s",
  "Los Angeles Clippers|2010s",
  "Atlanta Hawks|1960s",
  "Brooklyn Nets|1970s",
  "Los Angeles Lakers|2010s",
  "New York Knicks|1980s",
  "Orlando Magic|2000s",
  "Detroit Pistons|1970s",
  "Utah Jazz|1970s",
  "Boston Celtics|1970s",
  "Houston Rockets|1970s",
  "Boston Celtics|1990s",
  "Boston Celtics|2010s",
  "Cleveland Cavaliers|1970s",
  "Oklahoma City Thunder|1960s",
  "Houston Rockets|2000s",
  "Los Angeles Clippers|1960s",
  "Detroit Pistons|1960s",
  "Phoenix Suns|1960s",
  "San Antonio Spurs|1970s",
  "Atlanta Hawks|1970s",
  "Los Angeles Clippers|1970s",
  "Brooklyn Nets|2000s",
  "Philadelphia 76ers|1990s",
  "Minnesota Timberwolves|2010s",
  "New Orleans Pelicans|2000s"
]);

function getFranchiseWeight(team, decade) {
  const key = team + "|" + decade;
  if (RARE_FRANCHISES.has(key)) return 6;
  if (UNCOMMON_FRANCHISES.has(key)) return 8;
  return 45;
}

function rollSlot() {
  // Build one global weighted pool of all franchise/decade combos
  // This ensures true global rarity — Rare is always ~3.7% regardless of decade
  const allCombos = [];
  getDecades().forEach(decade => {
    getTeamsForDecade(decade).forEach(team => {
      const weight = getFranchiseWeight(team, decade);
      for (let i = 0; i < weight; i++) {
        allCombos.push({ team, decade });
      }
    });
  });
  return allCombos[Math.floor(Math.random() * allCombos.length)];
}

function getEligibleOpenSlots(player, roster, excludeIdx=-1) {
  const filled = roster.filter((_,i)=>i!==excludeIdx).map(r=>r.filledAs);
  return player.positions.filter(p=>!filled.includes(p));
}
function canSwap(roster, iA, iB) {
  return roster[iA].player.positions.includes(roster[iB].filledAs) &&
         roster[iB].player.positions.includes(roster[iA].filledAs);
}

function scoreTeam(roster) {
  if (roster.length!==5) return null;
  const t = roster.reduce((a,r)=>({
    ppg:a.ppg+r.player.ppg, rpg:a.rpg+r.player.rpg,
    apg:a.apg+r.player.apg, spg:a.spg+r.player.spg, bpg:a.bpg+r.player.bpg
  }), {ppg:0,rpg:0,apg:0,spg:0,bpg:0});

  const rebScore = t.rpg<=50 ? t.rpg : 50+(t.rpg-50)*0.12;
  const apgR = Math.round(t.apg*10)/10;
  const assistMult = apgR>=23?1.04 : apgR>=19?1.03 : apgR>=14?0.98 : apgR>=9?0.92 : 0.88;
  const raw = (t.ppg*assistMult) + rebScore + (t.apg*1.5) + (t.spg*3.0) + (t.bpg*3.0);

  const hofCount = roster.filter(r=>HOF_PLAYERS.has(r.player.name)).length;
  const hofBonus = hofCount>=5?6 : hofCount>=4?4 : hofCount>=3?2 : hofCount>=2?1 : 0;

  const ppgMod = t.ppg * assistMult;
  const eliteCount = [
    ppgMod >= 120,
    t.rpg >= 40,
    t.apg >= 23,
    t.spg >= 7.0,
    t.bpg >= 5.0,
  ].filter(Boolean).length;
  const eliteBonus = eliteCount>=5?8 : eliteCount>=4?6 : eliteCount>=3?4 : eliteCount>=2?2 : 0;

  const rawWins = Math.min(82, Math.round(82*Math.pow(raw/252, 1.125)));
  const wins = Math.min(82, rawWins+hofBonus+eliteBonus);
  const losses = 82-wins;
  const grade = wins>=82?"S":wins>=70?"A":wins>=60?"B":wins>=50?"C":wins>=40?"D":"F";
  const gradeLabel = wins>=82?"LEGENDARY":wins>=70?"DYNASTY":wins>=60?"CONTENDER":wins>=50?"PLAYOFF":wins>=40?"BUBBLE":"LOTTERY";
  const ovr = Math.round(60+(raw/230)*55);
  return { totals:t, rebScore, assistMult, raw, hofCount, hofBonus, eliteCount, eliteBonus, wins, losses, grade, gradeLabel, ovr };
}

function SlotMachine({ spinning, result, onDone, spinMode="both" }) {
  const [display, setDisplay] = useState({decade:"????",team:"Spinning..."});
  const ref = useRef(0); const intRef = useRef(null);
  const staticTeam = useRef(""); const staticDecade = useRef("");
  useEffect(()=>{
    if (!spinning) return;
    ref.current=0;
    // Freeze the static value RIGHT NOW before result prop can change
    staticTeam.current = result.team;
    staticDecade.current = result.decade;
    if(spinMode==="decade") setDisplay({decade:"????",team:staticTeam.current});
    else if(spinMode==="team") setDisplay({decade:staticDecade.current,team:"Spinning..."});
    intRef.current=setInterval(()=>{
      if(spinMode==="decade"){
        const d=getDecades()[Math.floor(Math.random()*getDecades().length)];
        setDisplay({decade:d,team:staticTeam.current});
      } else if(spinMode==="team"){
        const teams=getTeamsForDecade(staticDecade.current);
        setDisplay({decade:staticDecade.current,team:teams[Math.floor(Math.random()*teams.length)]});
      } else {
        const d=getDecades()[Math.floor(Math.random()*getDecades().length)];
        const teams=getTeamsForDecade(d);
        setDisplay({decade:d,team:teams[Math.floor(Math.random()*teams.length)]});
      }
      ref.current++;
      if(ref.current>=32){ clearInterval(intRef.current); setDisplay(result); setTimeout(onDone,400); }
    },65);
    return ()=>clearInterval(intRef.current);
  },[spinning]);
  return (
    <div style={{background:"linear-gradient(135deg,#0f1923,#1a2535)",border:"2px solid #f4a426",borderRadius:20,padding:"22px 32px",textAlign:"center",minWidth:300}}>
      <div style={{color:"#f4a426",fontSize:10,letterSpacing:3,marginBottom:8}}>ROUND ASSIGNMENT</div>
      <div style={{color:"#fff",fontSize:32,fontWeight:900,fontFamily:"Georgia,serif"}}>{display.decade}</div>
      <div style={{color:"#94b4c8",fontSize:13,marginTop:6,minHeight:22}}>{display.team}</div>
      {!spinning && display.team && display.team !== "Spinning..." && (()=>{
        const key = display.team + "|" + display.decade;
        const isRare = RARE_FRANCHISES.has(key);
        const isUncommon = UNCOMMON_FRANCHISES.has(key);
        if (isRare) return <div style={{marginTop:8,background:"#f4a42620",border:"1px solid #f4a426",borderRadius:20,padding:"3px 12px",display:"inline-block",color:"#f4a426",fontSize:10,letterSpacing:2,fontWeight:700}}>★ RARE FRANCHISE</div>;
        if (isUncommon) return <div style={{marginTop:8,background:"#60a5fa20",border:"1px solid #60a5fa",borderRadius:20,padding:"3px 12px",display:"inline-block",color:"#60a5fa",fontSize:10,letterSpacing:2,fontWeight:700}}>◆ FEATURED FRANCHISE</div>;
        return null;
      })()}
    </div>
  );
}

function PosBadge({pos,dim,small}){
  return <span style={{background:dim?"transparent":POS_COLORS[pos]+"22",color:dim?"#3a4a5a":POS_COLORS[pos],
    border:`1px solid ${dim?"#2a3a4a":POS_COLORS[pos]+"55"}`,borderRadius:4,
    fontSize:small?9:10,padding:small?"1px 4px":"2px 6px",fontWeight:700,marginRight:3,display:"inline-block"}}>{pos}</span>;
}

function StatBar({label,value,max,color,note}){
  return <div style={{marginBottom:10}}>
    <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
      <span style={{color:"#94b4c8",fontSize:11}}>{label}</span>
      <span style={{color:"#fff",fontSize:11,fontWeight:700}}>{typeof value==="number"?value.toFixed(1):value}{note&&<span style={{color:"#f4a426",fontSize:9,marginLeft:4}}>{note}</span>}</span>
    </div>
    <div style={{background:"#1a2535",borderRadius:4,height:5}}>
      <div style={{width:`${Math.min(100,(value/max)*100)}%`,height:"100%",background:color,borderRadius:4,transition:"width .5s ease"}}/>
    </div>
  </div>;
}

export default function HoopTheory(){
  const [phase,setPhase]=useState("idle");
  const [roster,setRoster]=useState([]);
  const [currentSlot,setCurrentSlot]=useState(null);
  const [spinning,setSpinning]=useState(false);
  const [spinMode,setSpinMode]=useState('both');
  const [rerollDecade,setRerollDecade]=useState(1);
  const [rerollTeam,setRerollTeam]=useState(1);
  const [score,setScore]=useState(null);
  const [shareMsg,setShareMsg]=useState("");
  const [selectedIdx,setSelectedIdx]=useState(null);
  const [pendingPlayer,setPendingPlayer]=useState(null);
  const [pendingPositions,setPendingPositions]=useState([]);
  const [filter,setFilter]=useState("All");
  const [search,setSearch]=useState("");
  const [sortBy,setSortBy]=useState("PPG");
  const [usedNames,setUsedNames]=useState(new Set());
  const [showProfile,setShowProfile]=useState(false);
  const [showFirstVisit,setShowFirstVisit]=useState(()=>{
    try { return localStorage.getItem("ht_visited") !== "true"; } catch(e){ return true; }
  });
  const [profile,setProfile]=useState(null);
  const [recentGames,setRecentGames]=useState([]);
  const [showBestTeam,setShowBestTeam]=useState(false);
  const [usernameMsg,setUsernameMsg]=useState("");
  const [showMenu,setShowMenu]=useState(false);
  const [showPrivacy,setShowPrivacy]=useState(false);
  const [profileTab,setProfileTab]=useState("profile");
  const [leaderboard,setLeaderboard]=useState([]);
  const [lbLoading,setLbLoading]=useState(false);
  const [user,setUser]=useState(null);
  const [showAuth,setShowAuth]=useState(false);
  const [authEmail,setAuthEmail]=useState("");
  const [authPassword,setAuthPassword]=useState("");
  const [showPassword,setShowPassword]=useState(false);
  const [authMode,setAuthMode]=useState("password");
  const [authMsg,setAuthMsg]=useState("");

  const gradeColor={S:"#f4a426",A:"#4ade80",B:"#60a5fa",C:"#a78bfa",D:"#fb923c",F:"#f87171"};

  useEffect(()=>{
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if(session?.user) loadUserProfile(session.user.id);
      else { setProfile(null); setRecentGames([]); }
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if(session?.user) loadUserProfile(session.user.id);
    });
    return () => subscription.unsubscribe();
  },[]);

  async function loadUserProfile(userId){
    try {
      const { data: prof } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if(prof) setProfile(prof);
      const { data: games } = await supabase.from('games').select('*').eq('user_id', userId).order('created_at',{ascending:false}).limit(20);
      if(games) setRecentGames(games);
    } catch(e){ console.error('Load profile error', e); }
  }

  async function saveResult(scoreData, rosterData){
    if(!user) return;
    try {
      const bestTeamData = {
        roster: rosterData.map(r=>({filledAs:r.filledAs,player:{name:r.player.name,teamShort:r.player.teamShort,decade:r.player.decade,ppg:r.player.ppg,rpg:r.player.rpg,apg:r.player.apg,spg:r.player.spg,bpg:r.player.bpg}})),
        score:{wins:scoreData.wins,losses:scoreData.losses,grade:scoreData.grade,gradeLabel:scoreData.gradeLabel,ovr:scoreData.ovr},
        date: new Date().toLocaleDateString()
      };
      const existing = profile || {games_played:0, best_wins:0, best_ovr:0, best_team:null};
      const newBestWins = Math.max(existing.best_wins||0, scoreData.wins);
      const newBestOvr = Math.max(existing.best_ovr||0, scoreData.ovr);
      const newBestTeam = scoreData.wins > (existing.best_wins||0) ? bestTeamData : existing.best_team;
      const profileUpdate = {
        id: user.id,
        games_played: (existing.games_played||0) + 1,
        best_wins: newBestWins,
        best_ovr: newBestOvr,
        best_team: newBestTeam,
      };
      const { data: updatedProfile } = await supabase.from('profiles').upsert(profileUpdate).select().single();
      if(updatedProfile) setProfile(updatedProfile);
      const gameRecord = {
        user_id: user.id,
        wins: scoreData.wins, losses: scoreData.losses,
        grade: scoreData.grade, grade_label: scoreData.gradeLabel,
        ovr: scoreData.ovr,
        roster: rosterData.map(r=>({name:r.player.name, teamShort:r.player.teamShort, decade:r.player.decade, pos:r.filledAs}))
      };
      const { data: newGame } = await supabase.from('games').insert(gameRecord).select().single();
      if(newGame) setRecentGames(prev=>[newGame,...prev].slice(0,20));
    } catch(e){ console.error('Save error',e); }
  }

  function getOpenPositions(currentRoster){
    const filled = currentRoster.map(r=>r.filledAs);
    return ["PG","SG","SF","PF","C"].filter(p=>!filled.includes(p));
  }

  function hasEligiblePlayer(team, decade, currentRoster, currentUsedNames){
    const open = getOpenPositions(currentRoster);
    if(open.length === 0) return true;
    const pool = getPlayersForSlot(team, decade).filter(p=>!currentUsedNames.has(p.name));
    return pool.some(p => p.positions.some(pos => open.includes(pos)));
  }

  function startSpin(slot, mode="both"){
    let s = slot || rollSlot();
    // Auto-reroll if no eligible players for open positions
    let attempts = 0;
    while(!hasEligiblePlayer(s.team, s.decade, roster, usedNames) && attempts < 20){
      s = rollSlot();
      attempts++;
    }
    setCurrentSlot(s); setSpinning(true); setPhase("spinning"); setSpinMode(mode);
    setSelectedIdx(null); setPendingPlayer(null); setFilter("All"); setSearch(""); setSortBy("PPG");
  }
  function handleRerollDecade(){
    if(!rerollDecade)return; setRerollDecade(r=>r-1);
    // Pick a new decade that has the SAME team if possible
    // This keeps the team locked and only changes the era
    const allDecades=getDecades();
    const decadesWithSameTeam=allDecades.filter(d=>d!==currentSlot.decade&&getTeamsForDecade(d).includes(currentSlot.team));
    let d, newTeam;
    if(decadesWithSameTeam.length>0){
      // Same team exists in other decades - pick one of those
      d=decadesWithSameTeam[Math.floor(Math.random()*decadesWithSameTeam.length)];
      newTeam=currentSlot.team;
    } else {
      // Team doesn't exist in any other decade - pick a random decade and weighted team
      const otherDecades=allDecades.filter(dd=>dd!==currentSlot.decade);
      d=otherDecades[Math.floor(Math.random()*otherDecades.length)];
      const weightedTeams=[];
      getTeamsForDecade(d).forEach(t=>{
        const w=getFranchiseWeight(t,d);
        for(let i=0;i<w;i++) weightedTeams.push(t);
      });
      newTeam=weightedTeams[Math.floor(Math.random()*weightedTeams.length)];
    }
    startSpin({decade:d,team:newTeam}, "decade");
  }
  function handleRerollTeam(){
    if(!rerollTeam)return; setRerollTeam(r=>r-1);
    // Use weighted selection within the same decade
    const teams=getTeamsForDecade(currentSlot.decade);
    const weightedTeams=[];
    teams.forEach(t=>{
      const w=getFranchiseWeight(t,currentSlot.decade);
      for(let i=0;i<w;i++) weightedTeams.push(t);
    });
    const newTeam=weightedTeams[Math.floor(Math.random()*weightedTeams.length)];
    startSpin({decade:currentSlot.decade,team:newTeam}, "team");
  }
  function handlePickPlayer(player){
    const eligible=getEligibleOpenSlots(player,roster);
    if(!eligible.length)return;
    if(eligible.length===1){confirmPick(player,eligible[0]);}
    else{setPendingPlayer(player);setPendingPositions(eligible);}
  }
  // Nickname/real name aliases - prevent drafting same player twice
  const NAME_ALIASES = {
  "Fat Lever": ["Lafayette Lever"],
  "Lafayette Lever": ["Fat Lever"],
    "Tiny Archibald": ["Nate Archibald"],
    "Nate Archibald": ["Tiny Archibald"],
    "World B. Free": ["Lloyd Free"],
    "Lloyd Free": ["World B. Free"],
  };

  function confirmPick(player,pos){
    const newRoster=[...roster,{player,filledAs:pos}];
    setRoster(newRoster);
    const aliases = NAME_ALIASES[player.name] || [];
    setUsedNames(prev=>new Set([...prev,player.name,...aliases]));
    setPendingPlayer(null);setPendingPositions([]);
    if(newRoster.length===5){const s=scoreTeam(newRoster);setScore(s);setPhase("result");saveResult(s,newRoster);}
    else{setPhase("idle");}
  }
  function handleRosterTap(idx){ setSelectedIdx(prev=>prev===idx?null:idx); }
  function handleMovePlayer(idx,newPos){
    const nr=roster.map((r,i)=>i===idx?{...r,filledAs:newPos}:r);
    setRoster(nr); setSelectedIdx(null);
    if(nr.length===5)setScore(scoreTeam(nr));
  }
  function handleSwap(iA,iB){
    const nr=roster.map((r,i)=>{
      if(i===iA)return{...r,filledAs:roster[iB].filledAs};
      if(i===iB)return{...r,filledAs:roster[iA].filledAs};
      return r;
    });
    setRoster(nr); setSelectedIdx(null);
    if(nr.length===5)setScore(scoreTeam(nr));
  }
  function handleReset(){
    setRoster([]);setScore(null);setCurrentSlot(null);setRerollDecade(1);setRerollTeam(1);
    setPhase("idle");setShareMsg("");setSelectedIdx(null);setPendingPlayer(null);
    setUsedNames(new Set());setFilter("All");setSearch("");setSortBy("PPG");
    setShareUrl(null);
  }
  const [showShareCard, setShowShareCard] = useState(false);
  const shareCardRef = useRef(null);
  const [shareUrl, setShareUrl] = useState(null);
  const [creatingShare, setCreatingShare] = useState(false);

  async function handleShare(){
    setShowShareCard(true);
    setShareUrl(null);
    setCreatingShare(true);
    try {
      const res = await fetch('/api/share', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify({
          wins: score.wins,
          losses: score.losses,
          grade: score.grade,
          grade_label: score.gradeLabel,
          ovr: score.ovr,
          roster: roster.map(r=>({filledAs:r.filledAs,player:{name:r.player.name,teamShort:r.player.teamShort,decade:r.player.decade,ppg:r.player.ppg,rpg:r.player.rpg,apg:r.player.apg}})),
          user_id: user ? user.id : null,
          username: profile ? profile.username : null,
        })
      });
      const data = await res.json();
      if(data.id) setShareUrl("https://hooptheory.app/share/" + data.id);
    } catch(e){ console.error(e); }
    setCreatingShare(false);
  }

  async function doShare(platform){
    const url = shareUrl || "https://hooptheory.app";
    const names=roster.map(r=>`${r.player.name} (${r.player.teamShort} · ${r.player.decade})`).join("\n");
    const text=`🏀 Hoop Theory: ${score.wins}-${score.losses} | ${score.gradeLabel} | OVR ${score.ovr}\n${names}\n\nCan you beat me? ${url}`;
    if(platform==="native"){
      if(navigator.share){
        try {
          await navigator.share({ title: "Hoop Theory", text });
          setShareMsg("Shared!");
        } catch(e){
          if(e.name !== "AbortError"){
            navigator.clipboard.writeText(text).then(()=>setShareMsg("Copied!")).catch(()=>{});
          }
        }
      } else {
        navigator.clipboard.writeText(shareUrl||text).then(()=>setShareMsg("Copied!")).catch(()=>setShareMsg("Failed"));
      }
    } else if(platform==="copy"){
      navigator.clipboard.writeText(shareUrl||text).then(()=>setShareMsg("Copied!")).catch(()=>setShareMsg("Failed"));
    } else if(platform==="twitter"){
      const u = shareUrl||"https://hooptheory.app";
      const tweet = `🏀 I went ${score.wins}-${score.losses} (${score.gradeLabel}) on Hoop Theory. Can you beat me?\n${u}`;
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(tweet)}`, "_blank");
    } else if(platform==="facebook"){
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent("https://hooptheory.app")}`, "_blank");
    } else if(platform==="bluesky"){
      const bsText = `🏀 Hoop Theory: ${score.wins}-${score.losses} | ${score.gradeLabel}\n${roster.map(r=>r.player.name).join(" · ")}\n\nCan you beat me? hooptheory.app`;
      window.open(`https://bsky.app/intent/compose?text=${encodeURIComponent(bsText)}`, "_blank");
    } else if(platform==="whatsapp"){
      const waText = `🏀 Hoop Theory: ${score.wins}-${score.losses} | ${score.gradeLabel} | OVR ${score.ovr}\n${roster.map(r=>r.player.name).join(" · ")}\n\nCan you beat me? hooptheory.app`;
      window.open(`https://wa.me/?text=${encodeURIComponent(waText)}`, "_blank");
    } else if(platform==="telegram"){
      const tgText = `🏀 Hoop Theory: ${score.wins}-${score.losses} | ${score.gradeLabel} | OVR ${score.ovr}\n${roster.map(r=>r.player.name).join(" · ")}\n\nCan you beat me?`;
      window.open(`https://t.me/share/url?url=${encodeURIComponent("https://hooptheory.app")}&text=${encodeURIComponent(tgText)}`, "_blank");
    } else if(platform==="reddit"){
      const rdText = `Hoop Theory: ${score.wins}-${score.losses} | ${score.gradeLabel} | ${roster.map(r=>r.player.name).join(", ")} — Can you beat me?`;
      window.open(`https://reddit.com/submit?url=${encodeURIComponent("https://hooptheory.app")}&title=${encodeURIComponent(rdText)}`, "_blank");
    }
    setShowShareCard(false);
  }

  const rawPlayers = currentSlot ? getPlayersForSlot(currentSlot.team,currentSlot.decade).filter(p=>!usedNames.has(p.name)) : [];
  const filteredPlayers = rawPlayers
    .filter(p=>{ if(filter==="G")return p.positions.some(x=>["PG","SG"].includes(x)); if(filter==="F")return p.positions.some(x=>["SF","PF"].includes(x)); if(filter==="C")return p.positions.includes("C"); return true; })
    .filter(p=>search===""||p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a,b)=>b[sortBy.toLowerCase()]-a[sortBy.toLowerCase()]);

  const roundNum=roster.length+1;

  return(
    <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#060d14 0%,#0d1d2e 50%,#060d14 100%)",color:"#fff",fontFamily:"'Courier New',monospace",paddingBottom:80}}>
      <div style={{background:"linear-gradient(90deg,#0a1520,#0f2030,#0a1520)",borderBottom:"1px solid #f4a42630",padding:"14px 18px",display:"flex",alignItems:"center",justifyContent:"space-between",position:"sticky",top:0,zIndex:100}}>
        <div>
          <div style={{fontSize:18,fontWeight:900,color:"#f4a426",letterSpacing:2,fontFamily:"Georgia,serif"}}>HOOP THEORY</div>
          <div style={{fontSize:8,color:"#94b4c8",letterSpacing:3}}>BALANCED ROSTER BUILDER</div>
        </div>
        <div style={{display:"flex",gap:8,alignItems:"center"}}>
          <button onClick={()=>user ? setShowProfile(true) : setShowAuth(true)}
            style={{background:"none",border:"1px solid #60a5fa50",color:"#60a5fa",borderRadius:20,padding:"5px 14px",cursor:"pointer",fontSize:10,letterSpacing:1}}>
            {user ? "👤 PROFILE" : "🔑 SIGN IN"}
          </button>
          <button onClick={()=>setShowMenu(true)}
            style={{background:"none",border:"1px solid #ffffff20",color:"#fff",borderRadius:8,padding:"6px 12px",cursor:"pointer",fontSize:12,fontWeight:700,letterSpacing:1}}>
            MENU
          </button>
        </div>
      </div>


      {showAuth&&(
        <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#1a2535",borderRadius:20,padding:24,maxWidth:380,width:"100%"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{color:"#f4a426",fontSize:16,fontWeight:700}}>SIGN IN</div>
              <button onClick={()=>{setShowAuth(false);setAuthMsg("");setAuthMode("password");}} style={{background:"none",border:"none",color:"#aaa",fontSize:22,cursor:"pointer"}}>✕</button>
            </div>
            {authMsg ? (
              <div style={{background:"#0f1923",border:"1px solid #4ade8050",borderRadius:12,padding:16,color:"#4ade80",fontSize:13,textAlign:"center",marginBottom:12}}>{authMsg}
                <button onClick={()=>setAuthMsg("")} style={{display:"block",margin:"10px auto 0",background:"none",border:"none",color:"#8899aa",fontSize:12,cursor:"pointer"}}>Back</button>
              </div>
            ) : (
              <>
                <div style={{display:"flex",gap:6,marginBottom:16}}>
                  {["password","magic","signup"].map(m=>(
                    <button key={m} onClick={()=>setAuthMode(m)} style={{flex:1,background:authMode===m?"#f4a426":"#0f1923",border:"1px solid #2a3a4a",borderRadius:8,padding:"7px 0",color:authMode===m?"#000":"#8899aa",fontSize:10,fontWeight:700,cursor:"pointer"}}>
                      {m==="password"?"Sign In":m==="magic"?"Magic Link":"Sign Up"}
                    </button>
                  ))}
                </div>
                <input
                  type="email"
                  placeholder="your@email.com"
                  value={authEmail}
                  onChange={e=>setAuthEmail(e.target.value)}
                  style={{width:"100%",background:"#0f1923",border:"1px solid #2a3a4a",borderRadius:12,padding:"12px 16px",color:"#fff",fontSize:14,marginBottom:10,outline:"none",boxSizing:"border-box"}}
                />
                {(authMode==="password"||authMode==="signup")&&(
                  <div style={{position:"relative",marginBottom:10}}>
                    <input
                      type={showPassword?"text":"password"}
                      placeholder={authMode==="signup"?"Create a password":"Password"}
                      value={authPassword||""}
                      onChange={e=>setAuthPassword(e.target.value)}
                      style={{width:"100%",background:"#0f1923",border:"1px solid #2a3a4a",borderRadius:12,padding:"12px 44px 12px 16px",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box"}}
                    />
                    <button onClick={()=>setShowPassword(p=>!p)} style={{position:"absolute",right:12,top:"50%",transform:"translateY(-50%)",background:"none",border:"none",color:"#8899aa",cursor:"pointer",fontSize:16,padding:0}}>
                      {showPassword?"🙈":"👁️"}
                    </button>
                  </div>
                )}
                <button onClick={async()=>{
                  if(!authEmail) return;
                  if(authMode==="magic"){
                    const {error} = await supabase.auth.signInWithOtp({email:authEmail, options:{emailRedirectTo:"https://hooptheory.app"}});
                    if(error) setAuthMsg("Error: "+error.message);
                    else setAuthMsg("Check your email for a magic link!");
                  } else if(authMode==="signup"){
                    const {error} = await supabase.auth.signUp({email:authEmail, password:authPassword, options:{emailRedirectTo:"https://hooptheory.app"}});
                    if(error) setAuthMsg("Error: "+error.message);
                    else setAuthMsg("Account created! Check your email to confirm.");
                  } else {
                    const {error} = await supabase.auth.signInWithPassword({email:authEmail, password:authPassword});
                    if(error) setAuthMsg("Error: "+error.message);
                    else { setShowAuth(false); setAuthMsg(""); }
                  }
                }} style={{width:"100%",background:"#f4a426",border:"none",borderRadius:12,padding:14,color:"#000",fontSize:13,fontWeight:800,cursor:"pointer",letterSpacing:1,marginBottom:8}}>
                  {authMode==="magic"?"SEND MAGIC LINK":authMode==="signup"?"CREATE ACCOUNT":"SIGN IN"}
                </button>
                <button onClick={async()=>{
                  await supabase.auth.signInWithOAuth({provider:"google", options:{redirectTo:"https://hooptheory.app"}});
                }} style={{width:"100%",background:"#fff",border:"none",borderRadius:12,padding:14,color:"#000",fontSize:13,fontWeight:700,cursor:"pointer"}}>
                  Sign in with Google
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {showFirstVisit&&(
        <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:150,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{background:"#1a2535",borderRadius:20,padding:24,maxWidth:420,width:"100%",maxHeight:"80vh",overflowY:"auto"}}>
            <div style={{textAlign:"center",marginBottom:20}}>
              <div style={{color:"#f4a426",fontSize:22,fontWeight:900,letterSpacing:2,fontFamily:"Georgia,serif"}}>HOOP THEORY</div>
              <div style={{color:"#8899aa",fontSize:11,letterSpacing:2}}>BALANCED ROSTER BUILDER</div>
            </div>
            <div style={{color:"#fff",fontSize:14,fontWeight:700,marginBottom:12}}>How to Play</div>
            {[
              ["🎰 SPIN","Each round spins a random NBA franchise and decade. You draft one player from that team's pool."],
              ["📋 BUILD","Fill all 5 positions: PG · SG · SF · PF · C. You have 1 decade reroll and 1 team reroll per build."],
              ["⭐ SCORE","Your team is scored on PPG, RPG, APG, SPG, and BPG. Balance matters more than stacking one stat."],
              ["🎯 ASSISTS","19+ APG = bonus. Under 19 = penalty. Always draft a playmaker."],
              ["🛡️ DEFENSE","Steals and blocks carry 3x weight. A lockdown defender is worth more than their PPG suggests."],
              ["🏆 BONUSES","2 HOF players = +1 win. 3+ HOF = +2 wins. Hit 3+ elite stat categories = +2 wins. Stack both for legendary results."],
              ["🎯 GOAL","Go 82-0. It's harder than it sounds."],
            ].map(([title, desc])=>(
              <div key={title} style={{marginBottom:10,padding:"10px 12px",background:"#0f1923",borderRadius:10}}>
                <div style={{color:"#f4a426",fontSize:11,fontWeight:700,marginBottom:3}}>{title}</div>
                <div style={{color:"#94b4c8",fontSize:11,lineHeight:1.5}}>{desc}</div>
              </div>
            ))}
            <div style={{display:"flex",gap:10,marginTop:16}}>
              <button onClick={()=>{
                try { localStorage.setItem("ht_visited","true"); } catch(e){}
                setShowFirstVisit(false);
              }} style={{flex:1,background:"#1e2a3a",border:"1px solid #2a3a4a",borderRadius:12,padding:12,color:"#8899aa",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                Don't show again
              </button>
              <button onClick={()=>setShowFirstVisit(false)}
                style={{flex:1,background:"#f4a426",border:"none",borderRadius:12,padding:12,color:"#000",fontSize:12,fontWeight:800,cursor:"pointer"}}>
                Let's Play! 🏀
              </button>
            </div>
          </div>
        </div>
      )}

      {showProfile&&(
        <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:100,overflowY:"auto",padding:"24px 16px"}}>
          <div style={{maxWidth:480,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <div style={{color:"#fff",fontSize:20,fontWeight:800,letterSpacing:1}}>{profileTab==="leaderboard"?"LEADERBOARD":"YOUR PROFILE"}</div>
              <div style={{display:"flex",gap:8,alignItems:"center"}}>
                {user&&<button onClick={async()=>{await supabase.auth.signOut();setShowProfile(false);}} style={{background:"none",border:"1px solid #f8717150",color:"#f87171",borderRadius:20,padding:"4px 10px",cursor:"pointer",fontSize:10}}>Sign Out</button>}
                <button onClick={()=>{setShowProfile(false);setShowBestTeam(false);setProfileTab("profile");}} style={{background:"none",border:"none",color:"#aaa",fontSize:22,cursor:"pointer"}}>✕</button>
              </div>
            </div>

            <div style={{display:"flex",gap:8,marginBottom:20}}>
              {["profile","leaderboard"].map(tab=>(
                <button key={tab} onClick={async()=>{
                  setProfileTab(tab);
                  if(tab==="leaderboard" && leaderboard.length===0){
                    setLbLoading(true);
                    const {data} = await supabase.from('leaderboard').select('*').gt('best_wins',0).limit(50);
                    if(data) setLeaderboard(data);
                    setLbLoading(false);
                  }
                }} style={{flex:1,background:profileTab===tab?"#f4a426":"#1e2a3a",border:"none",borderRadius:10,padding:"8px 0",color:profileTab===tab?"#000":"#8899aa",fontSize:11,fontWeight:700,cursor:"pointer",letterSpacing:1,textTransform:"uppercase"}}>
                  {tab==="profile"?"👤 Profile":"🏆 Leaderboard"}
                </button>
              ))}
            </div>

            {profileTab==="leaderboard" ? (
              <div>
                {lbLoading ? (
                  <div style={{textAlign:"center",color:"#8899aa",padding:40}}>Loading...</div>
                ) : leaderboard.length===0 ? (
                  <div style={{textAlign:"center",color:"#8899aa",padding:40}}>
                    <div style={{fontSize:40,marginBottom:12}}>🏆</div>
                    <div style={{fontSize:14}}>No games on the leaderboard yet. Be the first!</div>
                  </div>
                ) : (
                  <div>
                    {leaderboard.map((entry,i)=>(
                      <div key={entry.id} style={{background: i===0?"#1e2a3a":i===1?"#1a2535":i===2?"#161e2c":"#111820", borderRadius:12,padding:"12px 16px",marginBottom:8,display:"flex",alignItems:"center",gap:12,border:i<3?`1px solid ${i===0?"#f4a42640":i===1?"#94a3b840":"#c084fc40"}`:"none"}}>
                        <div style={{fontSize:i===0?22:i===1?18:i===2?16:14,minWidth:28,textAlign:"center"}}>{i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}`}</div>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{color:"#fff",fontSize:13,fontWeight:700,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{entry.username||entry.id.slice(0,8)+"..."}</div>
                          <div style={{color:"#8899aa",fontSize:10,marginTop:2}}>{entry.games_played} games played</div>
                        </div>
                        <div style={{textAlign:"right"}}>
                          <div style={{color:i===0?"#f4a426":i===1?"#94a3b8":i===2?"#c084fc":"#fff",fontSize:16,fontWeight:800}}>{entry.best_wins}-{82-entry.best_wins}</div>
                          <div style={{color:"#8899aa",fontSize:10}}>OVR {entry.best_ovr}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : profile ? (
              <div>
                <div style={{marginBottom:16,display:"flex",gap:8,alignItems:"center"}}>
                  <input
                    type="text"
                    placeholder="Set your username"
                    defaultValue={profile.username||""}
                    id="username-input"
                    maxLength={20}
                    style={{flex:1,background:"#1e2a3a",border:"1px solid #2a3a4a",borderRadius:10,padding:"10px 14px",color:"#fff",fontSize:13,outline:"none"}}
                  />
                  <button onClick={async()=>{
                    const val = document.getElementById("username-input").value.trim();
                    if(!val) return;
                    setUsernameMsg("");
                    const {data, error} = await supabase.from('profiles').update({username:val}).eq('id',user.id).select().single();
                    if(error && error.code === '23505') {
                      setUsernameMsg("That username is taken. Try another.");
                    } else if(data) {
                      setProfile(data);
                      setUsernameMsg("Saved!");
                      setTimeout(()=>setUsernameMsg(""), 2000);
                    }
                  }} style={{background:"#f4a426",border:"none",borderRadius:10,padding:"10px 16px",color:"#000",fontSize:12,fontWeight:800,cursor:"pointer",whiteSpace:"nowrap"}}>
                    SAVE
                  </button>
                </div>
                {usernameMsg&&<div style={{fontSize:12,marginBottom:8,color:usernameMsg==="Saved!"?"#4ade80":"#f87171"}}>{usernameMsg}</div>}

                <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:10,marginBottom:20}}>
                  {[
                    {icon:"🏀",label:"Games Played",value:profile.games_played},
                    {icon:"🏆",label:"Best Record",value:`${profile.best_wins}-${82-profile.best_wins}`},
                    {icon:"⭐",label:"Best OVR",value:profile.best_ovr},
                  ].map(({icon,label,value})=>(
                    <div key={label} style={{background:"#1e2a3a",borderRadius:12,padding:"14px 10px",textAlign:"center"}}>
                      <div style={{fontSize:20,marginBottom:4}}>{icon}</div>
                      <div style={{color:"#fff",fontSize:18,fontWeight:800}}>{value}</div>
                      <div style={{color:"#8899aa",fontSize:10,marginTop:2}}>{label}</div>
                    </div>
                  ))}
                </div>

                {profile.best_team&&(
                  <div style={{marginBottom:20}}>
                    <button onClick={()=>setShowBestTeam(p=>!p)}
                      style={{width:"100%",background:"#1e2a3a",border:"1px solid #f4a42640",borderRadius:12,padding:"12px 16px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <span style={{color:"#f4a426",fontWeight:700,fontSize:13,letterSpacing:1}}>🏅 BEST TEAM</span>
                      <span style={{color:"#f4a426",fontSize:12}}>{showBestTeam?"▲":"▼"}</span>
                    </button>
                    {showBestTeam&&(
                      <div style={{background:"#151f2e",borderRadius:"0 0 12px 12px",padding:"12px 16px",border:"1px solid #f4a42630",borderTop:"none"}}>
                        <div style={{color:"#8899aa",fontSize:10,marginBottom:8}}>{profile.best_team.date} · {profile.best_team.score.wins}-{profile.best_team.score.losses} · {profile.best_team.score.gradeLabel} · OVR {profile.best_team.score.ovr}</div>
                        {profile.best_team.roster.map((r,i)=>(
                          <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #ffffff10"}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <div style={{background:"#2a3a4a",borderRadius:6,padding:"2px 7px",fontSize:10,fontWeight:700,color:"#60a5fa"}}>{r.filledAs}</div>
                              <div>
                                <div style={{color:"#fff",fontSize:13,fontWeight:600}}>{r.player.name}</div>
                                <div style={{color:"#8899aa",fontSize:10}}>{r.player.teamShort} · {r.player.decade}</div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{color:"#f4a426",fontSize:12,fontWeight:700}}>{r.player.ppg}pts</div>
                              <div style={{color:"#8899aa",fontSize:10}}>{r.player.rpg}reb · {r.player.apg}ast · {r.player.spg}stl · {r.player.bpg}blk</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                <div style={{marginBottom:8,color:"#fff",fontSize:14,fontWeight:700}}>Recent Games</div>
                {recentGames.length===0&&<div style={{color:"#8899aa",fontSize:12}}>No games yet.</div>}
                {recentGames.map((g,i)=>(
                  <div key={i} style={{background:"#1e2a3a",borderRadius:12,padding:"12px 16px",marginBottom:8,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{color:g.grade==="S"?"#f4a426":g.grade==="A"?"#4ade80":g.grade==="B"?"#60a5fa":g.grade==="C"?"#facc15":"#f87171",fontSize:13,fontWeight:800}}>{g.grade} {g.grade_label}</div>
                      <div style={{color:"#8899aa",fontSize:10,marginTop:2}}>{g.date}</div>
                    </div>
                    <div style={{textAlign:"right"}}>
                      <div style={{color:"#fff",fontSize:18,fontWeight:800}}>{g.wins}-{g.losses}</div>
                      <div style={{color:"#8899aa",fontSize:10}}>OVR {g.ovr}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{textAlign:"center",color:"#8899aa",padding:40}}>
                <div style={{fontSize:40,marginBottom:12}}>🏀</div>
                {user ? <div style={{fontSize:14}}>Play your first game to start tracking your profile!</div> : <><div style={{fontSize:14,marginBottom:16}}>Sign in to track your profile and appear on the leaderboard.</div><button onClick={()=>{setShowProfile(false);setShowAuth(true);}} style={{background:"#f4a426",border:"none",borderRadius:12,padding:"12px 24px",color:"#000",fontSize:13,fontWeight:800,cursor:"pointer"}}>SIGN IN</button></>}
              </div>
            )}
          </div>
        </div>
      )}

      {showShareCard&&score&&(
        <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:200,display:"flex",alignItems:"center",justifyContent:"center",padding:16}}>
          <div style={{width:"100%",maxWidth:400}}>
            {/* Share Card Preview */}
            <div ref={shareCardRef} id="hoop-share-card" style={{background:"linear-gradient(135deg,#0f1923 0%,#1a2535 100%)",borderRadius:16,padding:24,marginBottom:12,border:"1px solid #f4a42640"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
                <div>
                  <div style={{color:"#f4a426",fontSize:11,letterSpacing:3,fontWeight:700}}>HOOP THEORY</div>
                  <div style={{color:"#8899aa",fontSize:10,letterSpacing:1}}>BALANCED ROSTER BUILDER</div>
                </div>
                <div style={{textAlign:"right"}}>
                  <div style={{color:"#fff",fontSize:28,fontWeight:900,lineHeight:1}}>{score.wins}<span style={{color:"#f87171"}}>-{score.losses}</span></div>
                  <div style={{color:score.grade==="S"?"#f4a426":score.grade==="A"?"#4ade80":"#60a5fa",fontSize:11,fontWeight:700,letterSpacing:1}}>{score.gradeLabel}</div>
                </div>
              </div>
              <div style={{borderTop:"1px solid #ffffff15",paddingTop:12,marginBottom:12}}>
                {roster.map((r,i)=>(
                  <div key={i} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"5px 0",borderBottom:"1px solid #ffffff08"}}>
                    <div style={{display:"flex",alignItems:"center",gap:8}}>
                      <div style={{background:"#2a3a4a",borderRadius:4,padding:"1px 6px",fontSize:9,fontWeight:700,color:"#60a5fa"}}>{r.filledAs}</div>
                      <div style={{color:"#fff",fontSize:12,fontWeight:600}}>{r.player.name}</div>
                    </div>
                    <div style={{color:"#8899aa",fontSize:10}}>{r.player.teamShort} · {r.player.decade}</div>
                  </div>
                ))}
              </div>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{color:"#8899aa",fontSize:10}}>Can you go 82-0?</div>
                <div style={{color:"#f4a426",fontSize:10,fontWeight:700}}>hooptheory.app</div>
              </div>
              {creatingShare && <div style={{textAlign:"center",color:"#8899aa",fontSize:11,marginTop:10}}>Creating share link...</div>}
              {shareUrl && <div style={{textAlign:"center",marginTop:10}}>
                <a href={shareUrl} target="_blank" rel="noopener noreferrer" style={{display:"block",background:"#060d14",borderRadius:8,padding:"8px 12px",color:"#60a5fa",fontSize:11,wordBreak:"break-all",textDecoration:"none"}}>{shareUrl}</a>
              </div>}
            </div>

            {/* Share Buttons */}
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
              <button onClick={()=>doShare("twitter")} style={{background:"#000",border:"1px solid #333",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>𝕏 X / Twitter</button>
              <button onClick={()=>doShare("facebook")} style={{background:"#1877f2",border:"none",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>f Facebook</button>
              <button onClick={()=>doShare("bluesky")} style={{background:"#0085ff",border:"none",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>🦋 Bluesky</button>
              <button onClick={()=>doShare("whatsapp")} style={{background:"#25d366",border:"none",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>💬 WhatsApp</button>
              <button onClick={()=>doShare("telegram")} style={{background:"#0088cc",border:"none",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>✈️ Telegram</button>
              <button onClick={()=>doShare("reddit")} style={{background:"#ff4500",border:"none",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>🟠 Reddit</button>
              <button onClick={()=>doShare("native")} style={{background:"#1e2a3a",border:"1px solid #2a3a4a",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>📤 More...</button>
              <button onClick={()=>doShare("copy")} style={{background:"#1e2a3a",border:"1px solid #2a3a4a",borderRadius:12,padding:"12px 8px",color:"#fff",fontSize:12,fontWeight:700,cursor:"pointer"}}>📋 Copy</button>
            </div>

            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:8}}>
            </div>
            <button onClick={()=>setShowShareCard(false)} style={{width:"100%",background:"transparent",border:"1px solid #2a3a4a",borderRadius:12,padding:"10px",color:"#8899aa",fontSize:12,cursor:"pointer"}}>Cancel</button>
          </div>
        </div>
      )}

      {phase==="rules"&&(
        <div style={{maxWidth:600,margin:"24px auto",padding:"0 16px"}}>
          <button onClick={()=>setPhase("idle")} style={{background:"none",border:"none",color:"#f4a426",fontSize:13,fontWeight:700,cursor:"pointer",marginBottom:12,padding:0,letterSpacing:1}}>
            back
          </button>
          <div style={{background:"#0a1520",border:"1px solid #f4a42625",borderRadius:20,padding:24}}>
            <div style={{color:"#f4a426",fontSize:16,fontWeight:700,marginBottom:20,fontFamily:"Georgia,serif"}}>HOW TO PLAY</div>
            {[
              ["THE DRAFT","5 rounds. Each round randomly spins a franchise and decade. Pick one player from that pool. You get 1 Decade Reroll and 1 Team Reroll per build — use them separately or together. Once used, they're gone. Dynasty franchises (marked ★ RARE) spin less often — landing on the Showtime Lakers, Jordan's Bulls, or Wilt's Warriors is genuinely lucky. Featured franchises (◆) are uncommon. Most spins land on competitive but less star-studded teams, which means 82-0 requires smart stat building, not just cherry-picking legends."],
              ["POSITIONS","Fill all 5 slots: PG · SG · SF · PF · C. Players eligible for multiple positions can fill any open slot. Tap any drafted player to move them to a different open slot, or swap two players if both are eligible for each other's positions."],
              ["NO DUPLICATES","Draft a player once and they're gone from the entire pool — regardless of team or era. Take LeBron from Cleveland 2000s and he won't appear for Miami or LAL in later rounds."],
              ["SCORING: POINTS","Team PPG is adjusted by your assist total. Under 19 APG = penalty. 19-23 = small bonus. 23+ = elite bonus. A pure scoring team without a playmaker will always underperform."],
              ["SCORING: REBOUNDS & DEFENSE","Rebounds count fully up to 50 RPG. Steals and blocks carry 3x weight — a lockdown defender contributes far more than their raw numbers suggest."],
              ["BIG NAMES \u2260 WINS","Oscar Robertson, Michael Jordan, and Shaquille O'Neal on the same team might only win 63 games if their rebounds, assists, steals and blocks don't hold up. The engine only sees the numbers \u2014 not the names."],
              ["HALL OF FAME BONUS","2 HOFers = +1 win. 3 HOFers = +2 wins. 4 HOFers = +4 wins. 5 HOFers = +6 wins."],
              ["ELITE BALANCE BONUS","Hit 2 elite categories = +2 wins. 3=+4. 4=+6. 5=+8. Elite thresholds: 120+ PPG · 40+ RPG · 23+ APG · 7+ SPG · 5+ BPG. Steals and blocks now count separately — you need a ball hawk AND a shot blocker."],
              ["PATHS TO 82-0","🔥 SCORER'S PATH: Historic PPG (130+) with elite assists. Stack scorers but don't neglect your playmaker. ⚖️ BALANCED ELITE: Hit 3+ elite categories — 120+ PPG, 40+ RPG, 23+ APG, or 12+ SPG+BPG. The balance bonus rewards this. 🛡️ DEFENSIVE ANCHOR: Elite steals+blocks (12+) carry extra weight. Two-way players can overperform their PPG. ☠️ WHAT KILLS EVERY TEAM: Ignoring assists. Under 19 APG penalizes your scoring no matter how high it is."],
              ["THE WIN CURVE","82-0 requires near-perfect balance across most categories. You can have one weakness if everything else is exceptional \u2014 but you cannot coast on a single dominant stat."],
              ["FRANCHISE NAMES","All teams use their modern franchise name regardless of era. The 1970s Sacramento Kings are the old Kansas City-Omaha Kings. The 1990s Oklahoma City Thunder are the old Seattle SuperSonics. The 1960s Golden State Warriors are the old Philadelphia and San Francisco Warriors. Same franchise, different city — the players and stats reflect that specific era."],
              ["DEFENSIVE STATS & ERAS","Blocks and steals weren't officially tracked until 1973-74. For 1960s players, positional averages are used — Centers get ~2.5 BPG, Power Forwards ~1.5, and so on. This means drafting Wilt Chamberlain or Bill Russell isn't a defensive liability — their era just couldn't measure what they actually did. For 1970s players, individual estimates based on early tracking data and historical reputation are used. You can strategize around this: a 1960s Center with estimated blocks is still a defensive anchor, just not as precisely measured as a modern player."],
            ].map(([t,d])=>(
              <div key={t} style={{marginBottom:18}}>
                <div style={{color:"#f4a426",fontSize:9,letterSpacing:2,marginBottom:5}}>{t}</div>
                <div style={{color:"#94b4c8",fontSize:12,lineHeight:1.7}}>{d}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {phase!=="rules"&&(
        <div style={{maxWidth:640,margin:"0 auto",padding:"18px 14px"}}>
          <div style={{display:"flex",gap:6,marginBottom:18}}>
            {[1,2,3,4,5].map(n=>(
              <div key={n} style={{flex:1,height:4,borderRadius:2,transition:"background .3s",
                background:n<=roster.length?"#f4a426":n===roundNum&&phase!=="idle"?"#f4a42650":"#1a2535"}}/>
            ))}
          </div>

          {phase!=="spinning"&&roster.length<5&&(
            <div style={{display:"flex",gap:5,marginBottom:16}}>
              {ALL_POSITIONS.map(pos=>{
                const filled=roster.find(r=>r.filledAs===pos);
                return <div key={pos} style={{flex:1,background:filled?"#0f1923":"#070f18",
                  border:`1px solid ${filled?POS_COLORS[pos]+"50":"#1a2535"}`,borderRadius:10,padding:"7px 4px",textAlign:"center"}}>
                  <div style={{color:filled?POS_COLORS[pos]:"#2a3a4a",fontSize:10,fontWeight:700}}>{pos}</div>
                  <div style={{color:filled?"#94b4c8":"#1a2535",fontSize:8,marginTop:2}}>{filled?filled.player.name.split(" ").pop():"—"}</div>
                </div>;
              })}
            </div>
          )}

          {roster.length>0&&(
            <div style={{marginBottom:16}}>
              <div style={{color:"#94b4c8",fontSize:8,letterSpacing:3,marginBottom:8}}>YOUR ROSTER — tap to rearrange</div>
              <div style={{display:"flex",flexDirection:"column",gap:5}}>
                {[...roster].map((r,origIdx)=>({...r,origIdx})).sort((a,b)=>ALL_POSITIONS.indexOf(a.filledAs)-ALL_POSITIONS.indexOf(b.filledAs)).map((r)=>{
                  const idx=r.origIdx;
                  const isSelected=selectedIdx===idx;
                  const moveSlots=getEligibleOpenSlots(r.player,roster,idx);
                  const swappable=roster.filter((_,j)=>j!==idx&&canSwap(roster,idx,j));
                  const isHOF=HOF_PLAYERS.has(r.player.name);
                  return <div key={idx}>
                    <div onClick={()=>phase!=="spinning"&&handleRosterTap(idx)}
                      style={{background:isSelected?"#1a3040":"#0f1923",border:`1px solid ${isSelected?"#f4a426":"#1a2535"}`,
                        borderRadius:10,padding:"9px 12px",cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                      <div>
                        <PosBadge pos={r.filledAs}/>
                        <span style={{color:"#fff",fontSize:13,fontWeight:700,fontFamily:"Georgia,serif"}}>{r.player.name}</span>
                        {isHOF&&<span style={{color:"#f4a426",fontSize:9,marginLeft:5}}>★</span>}
                        <span style={{color:"#94b4c8",fontSize:10,marginLeft:6}}>{r.player.teamShort} · {r.player.decade}</span>
                      </div>
                      <div style={{color:"#94b4c8",fontSize:9,textAlign:"right"}}>
                        <div>{r.player.ppg}pts</div>
                        <div>{r.player.rpg}reb · {r.player.apg}ast · {r.player.spg}stl · {r.player.bpg}blk</div>
                      </div>
                    </div>
                    {isSelected&&(
                      <div style={{background:"#080f18",border:"1px solid #1a2535",borderBottomLeftRadius:10,borderBottomRightRadius:10,padding:"10px 12px"}}>
                        {moveSlots.length>0&&<div style={{marginBottom:8}}>
                          <div style={{color:"#94b4c8",fontSize:8,letterSpacing:2,marginBottom:6}}>MOVE TO OPEN SLOT</div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {moveSlots.map(pos=><button key={pos} onClick={()=>handleMovePlayer(idx,pos)}
                              style={{background:POS_COLORS[pos]+"18",border:`1px solid ${POS_COLORS[pos]}55`,color:POS_COLORS[pos],borderRadius:8,padding:"5px 12px",cursor:"pointer",fontSize:11,fontWeight:700}}>→ {pos}</button>)}
                          </div>
                        </div>}
                        {swappable.length>0&&<div>
                          <div style={{color:"#94b4c8",fontSize:8,letterSpacing:2,marginBottom:6}}>SWAP WITH</div>
                          <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                            {swappable.map(other=>{const j=roster.indexOf(other);return<button key={j} onClick={()=>handleSwap(idx,j)}
                              style={{background:"#1a2535",border:"1px solid #2a3a4a",color:"#fff",borderRadius:8,padding:"5px 10px",cursor:"pointer",fontSize:10}}>⇄ {other.player.name.split(" ").pop()} ({other.filledAs})</button>;})}
                          </div>
                        </div>}
                        {moveSlots.length===0&&swappable.length===0&&<div style={{color:"#3a4a5a",fontSize:11}}>No moves available.</div>}
                      </div>
                    )}
                  </div>;
                })}
              </div>
            </div>
          )}

          {phase==="idle"&&roster.length<5&&(
            <div style={{textAlign:"center",paddingTop:12}}>
              <div style={{color:"#94b4c8",fontSize:10,marginBottom:14,letterSpacing:1}}>ROUND {roundNum} OF 5</div>
              <button onClick={()=>startSpin()}
                style={{background:"linear-gradient(135deg,#f4a426,#e8891a)",border:"none",borderRadius:30,
                  padding:"15px 40px",color:"#060d14",fontSize:15,fontWeight:900,cursor:"pointer",
                  letterSpacing:2,fontFamily:"Georgia,serif",boxShadow:"0 4px 24px #f4a42650"}}>
                SPIN ROUND {roundNum}
              </button>
              <div style={{display:"flex",gap:16,justifyContent:"center",marginTop:14}}>
                <span style={{color:"#94b4c8",fontSize:10}}>🎲 Decade: <span style={{color:rerollDecade?"#4ade80":"#f87171"}}>{rerollDecade}</span></span>
                <span style={{color:"#94b4c8",fontSize:10}}>🏀 Team: <span style={{color:rerollTeam?"#4ade80":"#f87171"}}>{rerollTeam}</span></span>
              </div>
            </div>
          )}

          {(phase==="spinning"||phase==="picking")&&currentSlot&&(
            <div>
              <div style={{display:"flex",justifyContent:"center",marginBottom:16}}>
                <SlotMachine spinning={spinning} result={currentSlot} spinMode={spinMode} onDone={()=>{setSpinning(false);setPhase("picking");}}/>
              </div>
              {phase==="picking"&&<>
                <div style={{display:"flex",gap:8,justifyContent:"center",marginBottom:14}}>
                  <button onClick={handleRerollDecade} disabled={!rerollDecade}
                    style={{background:rerollDecade?"#1a2535":"#0a1010",border:`1px solid ${rerollDecade?"#f4a426":"#1a2535"}`,
                      color:rerollDecade?"#f4a426":"#2a3a4a",borderRadius:20,padding:"7px 14px",
                      cursor:rerollDecade?"pointer":"not-allowed",fontSize:10,letterSpacing:1}}>
                    🎲 DECADE ({rerollDecade})
                  </button>
                  <button onClick={handleRerollTeam} disabled={!rerollTeam}
                    style={{background:rerollTeam?"#1a2535":"#0a1010",border:`1px solid ${rerollTeam?"#60a5fa":"#1a2535"}`,
                      color:rerollTeam?"#60a5fa":"#2a3a4a",borderRadius:20,padding:"7px 14px",
                      cursor:rerollTeam?"pointer":"not-allowed",fontSize:10,letterSpacing:1}}>
                    🏀 TEAM ({rerollTeam})
                  </button>
                </div>
                {pendingPlayer&&<div style={{background:"#0f1923",border:"1px solid #f4a42650",borderRadius:14,padding:14,marginBottom:12}}>
                  <div style={{color:"#f4a426",fontSize:11,marginBottom:10}}>{pendingPlayer.name} can fill multiple positions — choose one:</div>
                  <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                    {pendingPositions.map(pos=><button key={pos} onClick={()=>confirmPick(pendingPlayer,pos)}
                      style={{background:POS_COLORS[pos]+"18",border:`1px solid ${POS_COLORS[pos]}`,color:POS_COLORS[pos],borderRadius:10,padding:"8px 18px",cursor:"pointer",fontSize:13,fontWeight:700}}>{pos}</button>)}
                    <button onClick={()=>{setPendingPlayer(null);setPendingPositions([]);}}
                      style={{background:"#1a2535",border:"1px solid #2a3a4a",color:"#94b4c8",borderRadius:10,padding:"8px 12px",cursor:"pointer",fontSize:10}}>Cancel</button>
                  </div>
                </div>}
                <div style={{display:"flex",gap:6,marginBottom:10,alignItems:"center"}}>
                  {["All","G","F","C"].map(f=><button key={f} onClick={()=>setFilter(f)}
                    style={{background:filter===f?"#f4a426":"#1a2535",color:filter===f?"#060d14":"#94b4c8",
                      border:"none",borderRadius:20,padding:"5px 12px",cursor:"pointer",fontSize:10,fontWeight:700}}>{f}</button>)}
                  <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search..."
                    style={{flex:1,background:"#0f1923",border:"1px solid #1a2535",borderRadius:20,padding:"5px 12px",color:"#fff",fontSize:11,outline:"none"}}/>
                  <select value={sortBy} onChange={e=>setSortBy(e.target.value)}
                    style={{background:"#0f1923",border:"1px solid #1a2535",borderRadius:20,padding:"5px 10px",color:"#94b4c8",fontSize:10,outline:"none",cursor:"pointer"}}>
                    {["PPG","RPG","APG","SPG","BPG"].map(s=><option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{color:"#94b4c8",fontSize:9,letterSpacing:3,marginBottom:8}}>{filteredPlayers.length} PLAYERS AVAILABLE</div>
                <div style={{display:"flex",flexDirection:"column",gap:6,maxHeight:440,overflowY:"auto"}}>
                  {filteredPlayers.length===0?<div style={{color:"#f87171",fontSize:12,padding:16,textAlign:"center"}}>No players match. Try clearing filters or rerolling.</div>
                  :filteredPlayers.map(p=>{
                    const eligible=getEligibleOpenSlots(p,roster);
                    const canPick=eligible.length>0;
                    const isHOF=HOF_PLAYERS.has(p.name);
                    return <button key={p.id} onClick={()=>canPick&&handlePickPlayer(p)} disabled={!canPick}
                      style={{background:canPick?"#0f1923":"#080f14",border:`1px solid ${canPick?"#2a3a4a":"#0f1520"}`,
                        borderRadius:12,padding:"10px 12px",cursor:canPick?"pointer":"not-allowed",
                        textAlign:"left",opacity:canPick?1:0.35,transition:"border-color .15s"}}
                      onMouseEnter={e=>canPick&&(e.currentTarget.style.borderColor="#f4a426")}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=canPick?"#2a3a4a":"#0f1520";}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                        <div style={{display:"flex",alignItems:"center",flexWrap:"wrap",gap:2}}>
                          {p.positions.map(pos=><PosBadge key={pos} pos={pos} dim={!eligible.includes(pos)} small/>)}
                          <span style={{color:canPick?"#fff":"#3a4a5a",fontSize:14,fontWeight:700,fontFamily:"Georgia,serif",marginLeft:2}}>{p.name}</span>
                          {isHOF&&<span style={{color:"#f4a426",fontSize:9,marginLeft:4}}>★</span>}
                        </div>
                        {!canPick&&<span style={{color:"#f87171",fontSize:8}}>POS FILLED</span>}
                      </div>
                      <div style={{display:"flex",gap:16}}>
                        {[["PPG",p.ppg],["RPG",p.rpg],["APG",p.apg],["SPG",p.spg],["BPG",p.bpg]].map(([l,v])=>(
                          <div key={l} style={{textAlign:"center"}}>
                            <div style={{color:l===sortBy?"#f4a426":canPick?"#fff":"#2a3a4a",fontSize:13,fontWeight:700}}>{v}</div>
                            <div style={{color:"#94b4c8",fontSize:9}}>{l}</div>
                          </div>
                        ))}
                      </div>
                    </button>;
                  })}
                </div>
              </>}
            </div>
          )}

          {phase==="result"&&score&&(
            <div>
              <div style={{background:"linear-gradient(135deg,#0f1923,#1a2535)",border:`2px solid ${gradeColor[score.grade]}40`,
                borderRadius:24,padding:"24px 20px",textAlign:"center",marginBottom:14}}>
                <div style={{color:"#94b4c8",fontSize:8,letterSpacing:3,marginBottom:8}}>PROJECTED RECORD</div>
                <div style={{fontSize:52,fontWeight:900,fontFamily:"Georgia,serif",letterSpacing:-1}}>
                  <span style={{color:"#fff"}}>{score.wins}</span>
                  <span style={{color:"#2a3a4a",margin:"0 10px"}}>—</span>
                  <span style={{color:"#f87171"}}>{score.losses}</span>
                </div>
                <div style={{display:"flex",justifyContent:"center",gap:24,marginTop:10,alignItems:"center"}}>
                  <div>
                    <span style={{fontSize:28,fontWeight:900,color:gradeColor[score.grade],fontFamily:"Georgia,serif"}}>{score.grade}</span>
                    <span style={{color:"#94b4c8",fontSize:11,marginLeft:8}}>{score.gradeLabel}</span>
                  </div>
                  <div style={{borderLeft:"1px solid #2a3a4a",paddingLeft:24}}>
                    <div style={{color:"#fff",fontSize:24,fontWeight:700}}>{score.ovr}</div>
                    <div style={{color:"#94b4c8",fontSize:9,letterSpacing:1}}>OVR</div>
                  </div>
                </div>
                {score.hofBonus>0&&<div style={{marginTop:10,color:"#f4a426",fontSize:11}}>★ {score.hofCount} Hall of Famers · +{score.hofBonus} win bonus</div>}
              </div>



              <div style={{background:"#0a1520",border:"1px solid #1a2535",borderRadius:16,padding:"14px 16px",marginBottom:12}}>
                <div style={{color:"#94b4c8",fontSize:8,letterSpacing:3,marginBottom:12}}>STAT BREAKDOWN</div>
                <StatBar label={`PPG${score.assistMult!==1?` (assist mod ${score.assistMult>=1?"+":""}${((score.assistMult-1)*100).toFixed(0)}%)`:""}` }
                  value={score.totals.ppg*score.assistMult} max={180} color={score.assistMult>=1?"#4ade80":"#f87171"}
                  note={score.assistMult<1?`${score.totals.apg.toFixed(1)} APG below 19 threshold`:null}/>
                <StatBar label={`RPG${score.totals.rpg>50?" (capped at 50)":""}`} value={score.rebScore} max={50} color="#60a5fa"
                  note={score.totals.rpg>50?`raw ${score.totals.rpg.toFixed(1)}`:null}/>
                <StatBar label="APG" value={score.totals.apg} max={40} color="#a78bfa"/>
                <StatBar label={`SPG (×3 weight)${score.totals.spg>=7.0?" ⭐":""}`} value={score.totals.spg} max={15} color="#f4a426"/>
                <StatBar label={`BPG (×3 weight)${score.totals.bpg>=5.0?" ⭐":""}`} value={score.totals.bpg} max={15} color="#fb923c"/>
              </div>

              <div style={{background:"#0a1520",border:"1px solid #1a2535",borderRadius:16,padding:"14px 16px",marginBottom:16}}>
                <div style={{color:"#94b4c8",fontSize:8,letterSpacing:3,marginBottom:10}}>ANALYSIS</div>
                {score.assistMult<0.97&&<div style={{color:"#fbbf24",fontSize:12,marginBottom:8,lineHeight:1.6}}>⚠️ Low assists ({score.totals.apg.toFixed(1)} APG) hurt scoring efficiency — need 19+ for neutral, 23+ for bonus.</div>}
                {score.totals.rpg>50&&<div style={{color:"#94b4c8",fontSize:12,marginBottom:8,lineHeight:1.6}}>📉 {score.totals.rpg.toFixed(1)} RPG exceeded the 50-board threshold — diminishing returns kicked in.</div>}
                {(()=>{
                const spg = score.totals.spg;
                const bpg = score.totals.bpg;
                const spgEl = spg >= 7.0;
                const bpgEl = bpg >= 5.0;
                if(spgEl && bpgEl) return <div style={{color:"#4ade80",fontSize:12,marginBottom:8,lineHeight:1.6}}>🛡️ Elite defense — {spg.toFixed(1)} SPG ⭐ + {bpg.toFixed(1)} BPG ⭐. This team locks down opponents.</div>;
                if(spgEl) return <div style={{color:"#60a5fa",fontSize:12,marginBottom:8,lineHeight:1.6}}>🛡️ Elite ball hawks — {spg.toFixed(1)} SPG ⭐. Add a shot blocker (5+ BPG) for full defensive elite.</div>;
                if(bpgEl) return <div style={{color:"#60a5fa",fontSize:12,marginBottom:8,lineHeight:1.6}}>🛡️ Elite shot blocking — {bpg.toFixed(1)} BPG ⭐. Add a ball hawk (7+ SPG) for full defensive elite.</div>;
                if(spg+bpg >= 9.5) return <div style={{color:"#60a5fa",fontSize:12,marginBottom:8,lineHeight:1.6}}>🛡️ Strong defensive team — {spg.toFixed(1)} SPG + {bpg.toFixed(1)} BPG.</div>;
                if(spg+bpg >= 7.5) return <div style={{color:"#94b4c8",fontSize:12,marginBottom:8,lineHeight:1.6}}>🛡️ Solid defense — {spg.toFixed(1)} SPG + {bpg.toFixed(1)} BPG. Room to improve.</div>;
                return <div style={{color:"#f87171",fontSize:12,marginBottom:8,lineHeight:1.6}}>⚠️ Weak defense — {spg.toFixed(1)} SPG + {bpg.toFixed(1)} BPG. You need defenders.</div>;
              })()}
              {(()=>{
                const ppg = score.totals.ppg * score.assistMult;
                if(ppg >= 125) return <div style={{color:"#4ade80",fontSize:12,marginBottom:8,lineHeight:1.6}}>🔥 Historically elite offense — {ppg.toFixed(1)} PPG after assist mod. This team can score from anywhere.</div>;
                if(ppg >= 115) return <div style={{color:"#60a5fa",fontSize:12,marginBottom:8,lineHeight:1.6}}>💪 Strong scoring lineup — {ppg.toFixed(1)} PPG after assist mod.</div>;
                if(ppg >= 100) return <div style={{color:"#94b4c8",fontSize:12,marginBottom:8,lineHeight:1.6}}>📊 Average offense — {ppg.toFixed(1)} PPG. Look for bigger scorers next build.</div>;
                return <div style={{color:"#f87171",fontSize:12,marginBottom:8,lineHeight:1.6}}>😬 Weak scoring — {ppg.toFixed(1)} PPG. This team struggles to put up points.</div>;
              })()}
              {(()=>{
                const rpg = score.totals.rpg;
                if(rpg >= 40) return <div style={{color:"#4ade80",fontSize:12,marginBottom:8,lineHeight:1.6}}>💪 Dominant on the boards — {rpg.toFixed(1)} RPG. Great interior presence.</div>;
                if(rpg >= 37) return <div style={{color:"#60a5fa",fontSize:12,marginBottom:8,lineHeight:1.6}}>📊 Solid rebounding — {rpg.toFixed(1)} RPG.</div>;
                if(rpg >= 30) return <div style={{color:"#94b4c8",fontSize:12,marginBottom:8,lineHeight:1.6}}>⚠️ Undersized front court — {rpg.toFixed(1)} RPG. Rebounds are costing you wins.</div>;
                return <div style={{color:"#f87171",fontSize:12,marginBottom:8,lineHeight:1.6}}>😬 Serious rebounding problem — {rpg.toFixed(1)} RPG. You need bigger bodies.</div>;
              })()}
              {(()=>{
                const apg = score.totals.apg;
                if(apg >= 23) return <div style={{color:"#4ade80",fontSize:12,marginBottom:8,lineHeight:1.6}}>🎯 Elite ball movement — {apg.toFixed(1)} APG. Assists are boosting your score.</div>;
                if(apg >= 19) return <div style={{color:"#60a5fa",fontSize:12,marginBottom:8,lineHeight:1.6}}>✅ Good passing — {apg.toFixed(1)} APG. Assist threshold met.</div>;
                if(apg >= 14) return <div style={{color:"#94b4c8",fontSize:12,marginBottom:8,lineHeight:1.6}}>⚠️ Below the assist threshold — {apg.toFixed(1)} APG. A playmaker would help.</div>;
                return <div style={{color:"#f87171",fontSize:12,marginBottom:8,lineHeight:1.6}}>😬 Low assists are penalizing your score — {apg.toFixed(1)} APG. Target playmakers.</div>;
              })()}
                {score.hofBonus>0&&<div style={{color:"#f4a426",fontSize:12,marginBottom:8,lineHeight:1.6}}>★ {score.hofCount} Hall of Famers earned a +{score.hofBonus} win bonus.</div>}
              {score.eliteBonus>0&&<div style={{color:"#a78bfa",fontSize:12,marginBottom:8,lineHeight:1.6}}>⚡ {score.eliteCount} elite categories earned a +{score.eliteBonus} balance bonus.</div>}
                {score.wins===82&&<div style={{color:"#f4a426",fontSize:13,fontWeight:700,lineHeight:1.6}}>🏆 82-0. The perfect balanced roster. You found the needle in the haystack.</div>}
              {(()=>{
                const ppg = score.totals.ppg * score.assistMult;
                const rpg = score.totals.rpg;
                const apg = score.totals.apg;
                const wins = score.wins;
                if(wins >= 82) return null;
                // Find weakest category to call out
                // Score each category as % of its ideal target
                const scores = [
                  {label:"scoring", val:ppg, target:122, unit:"PPG"},
                  {label:"rebounding", val:rpg, target:40, unit:"RPG"},
                  {label:"assists", val:apg, target:23, unit:"APG"},
                  {label:"steals", val:score.totals.spg, target:7.0, unit:"SPG"},
                  {label:"blocks", val:score.totals.bpg, target:5.0, unit:"BPG"},
                ];
                const weakest = scores.reduce((a,b) => (a.val/a.target < b.val/b.target) ? a : b);
                const pct = Math.round((weakest.val/weakest.target)*100);
                const apgPenalty = apg < 19 ? " — you're being penalized" : "";
                const weakStr = ` Your weakest category is ${weakest.label} (${weakest.val.toFixed(1)} ${weakest.unit}, ${pct}% of ideal${weakest.label==="assists"?apgPenalty:""}).`;
                if(wins >= 70) return <div style={{color:"#a78bfa",fontSize:12,marginTop:8,lineHeight:1.6}}>📈 <strong>To reach 82-0:</strong> You're close.{weakStr} Push your weakest stat higher — every point counts toward the raw score.</div>;
                if(wins >= 60) return <div style={{color:"#60a5fa",fontSize:12,marginTop:8,lineHeight:1.6}}>📈 <strong>To reach A DYNASTY:</strong>{weakStr} Focus on that category next build — balanced stats across all five areas is the key.</div>;
                if(wins >= 50) return <div style={{color:"#94b4c8",fontSize:12,marginTop:8,lineHeight:1.6}}>📈 <strong>To reach B CONTENDER:</strong> You need 2-3 improvements.{weakStr} Get scoring above 110 PPG first — then balance out your weakest stats.</div>;
                if(wins >= 40) return <div style={{color:"#f87171",fontSize:12,marginTop:8,lineHeight:1.6}}>📈 <strong>To reach C PLAYOFF:</strong> Pick one path from the rules and commit from round 1.{weakStr} Use rerolls strategically to target your weak categories.</div>;
                return <div style={{color:"#f87171",fontSize:12,marginTop:8,lineHeight:1.6}}>📈 <strong>To escape LOTTERY:</strong> Every category needs work.{weakStr} Use the rules to understand the three paths to 82-0 and target elite players from rare franchises.</div>;
              })()}
                {score.wins<55&&<div style={{color:"#94b4c8",fontSize:12,lineHeight:1.6}}>Remember — big names don't equal wins. Stats in all five categories matter equally.</div>}
              </div>

              <div style={{display:"flex",gap:10}}>
                <button onClick={handleShare}
                  style={{flex:1,background:"linear-gradient(135deg,#f4a426,#e8891a)",border:"none",borderRadius:14,padding:14,color:"#060d14",fontSize:12,fontWeight:900,cursor:"pointer",letterSpacing:1}}>
                  {shareMsg||"📋 SHARE RESULT"}
                </button>
                <button onClick={handleReset}
                  style={{flex:1,background:"#1a2535",border:"1px solid #2a3a4a",borderRadius:14,padding:14,color:"#94b4c8",fontSize:12,fontWeight:700,cursor:"pointer",letterSpacing:1}}>
                  BUILD ANOTHER
                </button>
              </div>

            </div>
          )}
        </div>
      )}
            {/* Footer */}
      {phase==="idle"&&(
        <div style={{padding:"20px 16px",textAlign:"center",borderTop:"1px solid #ffffff08",marginTop:8}}>
          <div style={{color:"#fff",fontSize:13,fontWeight:700,marginBottom:12}}>Enjoying Hoop Theory?</div>
          <div style={{display:"flex",gap:10,justifyContent:"center",marginBottom:16}}>
            <a href="https://ko-fi.com/playhooptheory" target="_blank" rel="noopener noreferrer"
              style={{background:"#f4a426",borderRadius:20,padding:"8px 18px",color:"#000",fontSize:12,fontWeight:800,textDecoration:"none",letterSpacing:1}}>
              ☕ Support Us
            </a>
            <a href="mailto:feedback@hooptheory.app"
              style={{background:"transparent",border:"1px solid #2a3a4a",borderRadius:20,padding:"8px 18px",color:"#8899aa",fontSize:12,fontWeight:700,textDecoration:"none",letterSpacing:1}}>
              💬 Share Feedback
            </a>
          </div>
          <div style={{color:"#4a5a6a",fontSize:9,lineHeight:1.6,maxWidth:340,margin:"0 auto"}}>
            Hoop Theory is an independent project and is not affiliated with, endorsed by, or sponsored by the National Basketball Association or any of its teams or players.
          </div>
        </div>
      )}

      {showMenu && (
        <div style={{position:"fixed",inset:0,zIndex:200,background:"rgba(0,0,0,0.5)"}} onClick={()=>setShowMenu(false)}>
          <div style={{position:"absolute",top:0,left:0,bottom:0,width:280,background:"#0a1520",borderRight:"1px solid #1e2f40",display:"flex",flexDirection:"column"}} onClick={function(e){e.stopPropagation();}}>
            <div style={{padding:"24px 20px",borderBottom:"1px solid #1e2f40",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div>
                <div style={{fontFamily:"Georgia,serif",fontSize:18,fontWeight:900,color:"#f4a426",letterSpacing:2}}>HOOP THEORY</div>
                <div style={{fontSize:9,color:"#4a6a8a",letterSpacing:3,marginTop:2}}>BALANCED ROSTER BUILDER</div>
              </div>
              <button onClick={()=>setShowMenu(false)} style={{background:"none",border:"none",color:"#aaa",fontSize:22,cursor:"pointer"}}>X</button>
            </div>
            <div style={{flex:1,padding:"8px 0"}}>
              <button onClick={function(){setPhase("rules");setShowMenu(false);}} style={{width:"100%",background:"none",border:"none",borderBottom:"1px solid #ffffff08",padding:"18px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",color:"#fff",fontSize:14,fontWeight:600,textAlign:"left"}}>
                <span>Rules</span>
              </button>
              <button onClick={function(){if(user){setShowProfile(true);}else{setShowAuth(true);}setShowMenu(false);}} style={{width:"100%",background:"none",border:"none",borderBottom:"1px solid #ffffff08",padding:"18px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",color:"#fff",fontSize:14,fontWeight:600,textAlign:"left"}}>
                <span>Profile</span>
              </button>
              <button onClick={function(){window.open("https://ko-fi.com/playhooptheory","_blank");setShowMenu(false);}} style={{width:"100%",background:"none",border:"none",borderBottom:"1px solid #ffffff08",padding:"18px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",color:"#f4a426",fontSize:14,fontWeight:600,textAlign:"left"}}>
                <span>Support Us</span>
              </button>
              <button onClick={function(){setShowPrivacy(true);setShowMenu(false);}} style={{width:"100%",background:"none",border:"none",borderBottom:"1px solid #ffffff08",padding:"18px 20px",display:"flex",alignItems:"center",gap:14,cursor:"pointer",color:"#fff",fontSize:14,fontWeight:600,textAlign:"left"}}>
                <span>Privacy Policy</span>
              </button>
            </div>
            <div style={{padding:"20px",borderTop:"1px solid #1e2f40"}}>
              <div style={{fontSize:10,color:"#2a4a6a",lineHeight:1.6}}>Hoop Theory is not affiliated with the NBA or any of its teams or players.</div>
            </div>
          </div>
        </div>
      )}

      {showPrivacy && (
        <div style={{position:"fixed",inset:0,background:"#000000ee",zIndex:200,overflowY:"auto",padding:"24px 16px"}}>
          <div style={{maxWidth:560,margin:"0 auto"}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{color:"#fff",fontSize:20,fontWeight:800}}>Privacy Policy</div>
              <button onClick={()=>setShowPrivacy(false)} style={{background:"none",border:"none",color:"#aaa",fontSize:22,cursor:"pointer"}}>X</button>
            </div>
            <div style={{background:"#0f1923",borderRadius:16,padding:"24px 20px"}}>
              <div style={{color:"#8899aa",fontSize:11,marginBottom:16}}>Last updated June 9, 2026</div>
              <div style={{color:"#ccd9e8",fontSize:13,lineHeight:1.8,marginBottom:16}}>Hoop Theory is a free browser-based basketball game. This policy explains what we collect and why.</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1e2f40"}}>Information We Collect</div>
              <div style={{color:"#94b4c8",fontSize:13,lineHeight:1.8,marginBottom:16}}>If you sign up, we store your email and username. We save your game history and scores so you can track your progress. You can play without an account and nothing will be saved. We also cache settings in your browser locally.</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1e2f40"}}>How We Use It</div>
              <div style={{color:"#94b4c8",fontSize:13,lineHeight:1.8,marginBottom:16}}>To run the game, authenticate your account, save your rosters, and show your profile stats. We do not sell your data.</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1e2f40"}}>Service Providers</div>
              <div style={{color:"#94b4c8",fontSize:13,lineHeight:1.8,marginBottom:16}}>Supabase for authentication and database. Vercel for hosting. Resend for email delivery.</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1e2f40"}}>Your Rights</div>
              <div style={{color:"#94b4c8",fontSize:13,lineHeight:1.8,marginBottom:16}}>You can play anonymously at any time. To delete your account and data, email privacy@hooptheory.app. To clear local data, clear your browser storage.</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1e2f40"}}>Children</div>
              <div style={{color:"#94b4c8",fontSize:13,lineHeight:1.8,marginBottom:16}}>Hoop Theory is not directed to children under 13 and we do not knowingly collect their information.</div>
              <div style={{color:"#fff",fontWeight:700,fontSize:14,marginBottom:8,paddingBottom:8,borderBottom:"1px solid #1e2f40"}}>Changes</div>
              <div style={{color:"#94b4c8",fontSize:13,lineHeight:1.8}}>We may update this policy as the game evolves. We will update the date above when we do.</div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
