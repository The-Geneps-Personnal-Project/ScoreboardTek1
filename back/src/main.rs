use postgres::{Client, NoTls};
use postgres::Error as PostgresError;
use std::net::{TcpListener, TcpStream};
use std::io::{Read, Write};
use std::env;

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize)]
struct Teams {
    id: Option<i32>,
    name: String,
    logo: String,
    score: i32,
}

const DB_URL: &str = env!("DATABASE_URL");

const OK_RESPONSE: &str = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\n";
const NOT_FOUND: &str = "HTTP/1.1 404 NOT FOUND\r\n\r\n";
const INTERNAL_SERVER_ERROR: &str = "HTTP/1.1 500 INTERNAL SERVER ERROR\r\n\r\n";

fn main() {
    //Set database
    if let Err(e) = set_database() {
        println!("Error: {}", e);
        return;
    }

    //start server and print port
    let listener = TcpListener::bind(format!("0.0.0.0:8080")).unwrap();
    println!("Server started at port 8080");

    //handle the client
    for stream in listener.incoming() {
        match stream {
            Ok(stream) => {
                handle_connection(stream);
            }
            Err(e) => {
                println!("Error: {}", e);
            }
        }
    }
}

fn handle_connection(mut stream: TcpStream) {
    let mut buffer = [0; 1024];
    let mut req = String::new();

    match stream.read(&mut buffer) {
        Ok(size) => {
            req.push_str(String::from_utf8_lossy(&buffer[..size]).as_ref());

            let response = match &*req {
                r if r.starts_with("POST /teams") => handle_post_request(r),
                r if r.starts_with("GET /teams/") => handle_get_request(r),
                r if r.starts_with("GET /teams") => handle_get_all_request(r),
                r if r.starts_with("PUT /teams/") => handle_put_request(r),
                r if r.starts_with("DELETE /teams/") => handle_delete_request(r),
                _ => {
                    let body = "404 Not found";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        NOT_FOUND,
                        body.len(),
                        body
                    );
                    (response, String::new())
                },
            };

            stream.write_all(response.0.as_bytes()).unwrap();
            stream.flush().unwrap();
        }
        Err(e) => {
            println!("Error reading from stream: {:?}", e);
        }
    }
}


fn handle_post_request(req: &str) -> (String, String) {
    match (get_teams_req_body(&req), Client::connect(DB_URL, NoTls)) {
        (Ok(team), Ok(mut client)) => {
            match client.execute(
                "INSERT INTO teams (name, logo, score) VALUES ($1, $2, $3)",
                &[&team.name, &team.logo, &team.score]
            ) {
                Ok(_) => {
                    let body = "{\"message\": \"Team inserted\"}";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        OK_RESPONSE,
                        body.len(),
                        body
                    );
                    (response, String::new())
                }
                Err(_) => {
                    let body = "{\"error\": \"Error inserting team\"}";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        INTERNAL_SERVER_ERROR,
                        body.len(),
                        body
                    );
                    (response, String::new())
                }
            }
        }
        _ => {
            let body = "{\"error\": \"Error inserting team\"}";
            let response = format!(
                "{}Content-Length: {}\r\n\r\n{}",
                INTERNAL_SERVER_ERROR,
                body.len(),
                body
            );
            (response, String::new())
        }
    }
}


fn handle_get_request(req: &str) -> (String, String) {
    match (get_id(&req).parse::<i32>(), Client::connect(DB_URL, NoTls)) {
        (Ok(id), Ok(mut client)) => {
            match client.query_one("SELECT * FROM teams WHERE id = $1", &[&id]) {
                Ok(row) => {
                    let team = Teams {
                        id: Some(row.get(0)),
                        name: row.get(1),
                        logo: row.get(2),
                        score: row.get(3),
                    };

                    match serde_json::to_string(&team) {
                        Ok(json) => {
                            let content_length = json.len();
                            let response = format!(
                                "{}Content-Length: {}\r\n\r\n{}",
                                OK_RESPONSE,
                                content_length,
                                json
                            );
                            (response, String::new())
                        }
                        Err(_) => {
                            let body = "{\"error\": \"Error serializing team\"}";
                            let response = format!(
                                "{}Content-Length: {}\r\n\r\n{}",
                                INTERNAL_SERVER_ERROR,
                                body.len(),
                                body
                            );
                            (response, String::new())
                        }
                    }
                }
                Err(_) => {
                    let body = "{\"error\": \"Team not found\"}";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        NOT_FOUND,
                        body.len(),
                        body
                    );
                    (response, String::new())
                }
            }
        }
        _ => {
            let body = "{\"error\": \"Error parsing request or connecting to database\"}";
            let response = format!(
                "{}Content-Length: {}\r\n\r\n{}",
                INTERNAL_SERVER_ERROR,
                body.len(),
                body
            );
            (response, String::new())
        }
    }
}


fn handle_get_all_request(_req: &str) -> (String, String) {
    match Client::connect(DB_URL, NoTls) {
        Ok(mut client) => {
            let mut teams = Vec::new();

            for row in client.query("SELECT * FROM teams", &[]).unwrap() {
                teams.push(Teams {
                    id: Some(row.get(0)),
                    name: row.get(1),
                    logo: row.get(2),
                    score: row.get(3),
                });
            }
            match serde_json::to_string(&teams) {
                Ok(json) => {
                    let content_length = json.len();
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        OK_RESPONSE,
                        content_length,
                        json
                    );
                    (response, String::new())
                }
                Err(_) => (INTERNAL_SERVER_ERROR.to_string(), "Error serializing teams".to_string()),
            }
        }
        _ => (INTERNAL_SERVER_ERROR.to_string(), "Error connecting to database".to_string()),
    }
}

fn handle_put_request(req: &str) -> (String, String) {
    match (get_id(&req).parse::<i32>(), get_teams_req_body(&req), Client::connect(DB_URL, NoTls)) {
        (Ok(id), Ok(team), Ok(mut client)) => {
            match client.execute(
                "UPDATE teams SET name = $1, logo = $2, score = $3 WHERE id = $4",
                &[&team.name, &team.logo, &team.score, &id]
            ) {
                Ok(rows) => {
                    if rows == 0 {
                        let body = "{\"error\": \"Team not found\"}";
                        let response = format!(
                            "{}Content-Length: {}\r\n\r\n{}",
                            NOT_FOUND,
                            body.len(),
                            body
                        );
                        return (response, String::new());
                    }

                    let body = "{\"message\": \"Team updated\"}";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        OK_RESPONSE,
                        body.len(),
                        body
                    );
                    return (response, String::new());
                }
                Err(_) => {
                    let body = "{\"error\": \"Error updating team\"}";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        INTERNAL_SERVER_ERROR,
                        body.len(),
                        body
                    );
                    return (response, String::new());
                }
            }
        }
        _ => {
            let body = "{\"error\": \"Error parsing request or connecting to database\"}";
            let response = format!(
                "{}Content-Length: {}\r\n\r\n{}",
                INTERNAL_SERVER_ERROR,
                body.len(),
                body
            );
            return (response, String::new());
        }
    }
}

fn handle_delete_request(req: &str) -> (String, String) {
    match (get_id(&req).parse::<i32>(), Client::connect(DB_URL, NoTls)) {
        (Ok(id), Ok(mut client)) => {
            let rows = match client.execute("DELETE FROM teams WHERE id = $1", &[&id]) {
                Ok(rows) => rows,
                Err(_) => {
                    let body = "{\"error\": \"Error executing delete\"}";
                    let response = format!(
                        "{}Content-Length: {}\r\n\r\n{}",
                        INTERNAL_SERVER_ERROR,
                        body.len(),
                        body
                    );
                    return (response, String::new());
                }
            };

            if rows == 0 {
                let body = "{\"error\": \"Team not found\"}";
                let response = format!(
                    "{}Content-Length: {}\r\n\r\n{}",
                    NOT_FOUND,
                    body.len(),
                    body
                );
                return (response, String::new());
            }

            let body = "{\"message\": \"Team deleted\"}";
            let response = format!(
                "{}Content-Length: {}\r\n\r\n{}",
                OK_RESPONSE,
                body.len(),
                body
            );
            (response, String::new())
        }
        _ => {
            let body = "{\"error\": \"Error parsing request or connecting to database\"}";
            let response = format!(
                "{}Content-Length: {}\r\n\r\n{}",
                INTERNAL_SERVER_ERROR,
                body.len(),
                body
            );
            (response, String::new())
        }
    }
}

fn set_database() -> Result<(), PostgresError> {
    let mut client = Client::connect(DB_URL, NoTls)?;

    client.batch_execute("
        CREATE TABLE IF NOT EXISTS teams (
            id SERIAL PRIMARY KEY,
            name TEXT NOT NULL,
            logo TEXT NOT NULL,
            score INT NOT NULL
        )
    ")?;
    println!("Database table created");
    Ok(())
}

fn get_id(req: &str) -> &str {
    req.split("/").nth(2).unwrap_or_default().split_whitespace().next().unwrap_or_default()
}

// Deserialize teams from request body with the id
fn get_teams_req_body(req: &str) -> Result<Teams, serde_json::Error> {
    serde_json::from_str(req.split("\r\n\r\n").last().unwrap_or_default())
}