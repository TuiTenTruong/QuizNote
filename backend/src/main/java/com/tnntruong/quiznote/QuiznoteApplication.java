package com.tnntruong.quiznote;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class QuiznoteApplication {

	public static void main(String[] args) {
		SpringApplication.run(QuiznoteApplication.class, args);
	}

}
