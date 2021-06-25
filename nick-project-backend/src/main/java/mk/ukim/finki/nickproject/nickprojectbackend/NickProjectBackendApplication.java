package mk.ukim.finki.nickproject.nickprojectbackend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class NickProjectBackendApplication {

    public static void main(String[] args) {
        SpringApplication.run(NickProjectBackendApplication.class, args);
    }

}
