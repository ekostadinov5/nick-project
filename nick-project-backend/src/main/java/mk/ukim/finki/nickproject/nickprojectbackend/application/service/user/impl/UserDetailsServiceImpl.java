package mk.ukim.finki.nickproject.nickprojectbackend.application.service.user.impl;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.repository.user.UserDetailsRepository;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsServiceImpl implements org.springframework.security.core.userdetails.UserDetailsService {
    private final UserDetailsRepository userDetailsRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public UserDetailsServiceImpl(UserDetailsRepository userDetailsRepository) {
        this.userDetailsRepository = userDetailsRepository;
        this.bCryptPasswordEncoder = new BCryptPasswordEncoder();
    }

    @Override
    public UserDetails loadUserByUsername(String s) throws UsernameNotFoundException {
        return userDetailsRepository.findByUsername(s);
    }

    public void registerUser(String email, String password) {
        String encodedPassword = bCryptPasswordEncoder.encode(password);
        mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserDetails userDetails =
                new mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserDetails(email, encodedPassword);
        this.userDetailsRepository.saveAndFlush(userDetails);
    }

    public void changeUserEmail(String oldEmail, String newEmail) {
        mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserDetails userDetails =
                this.userDetailsRepository.findByUsername(oldEmail);
        userDetails.setUsername(newEmail);
        this.userDetailsRepository.saveAndFlush(userDetails);
    }

    public void changeUserPassword(String email, String oldPassword, String newPassword) {
        mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user.UserDetails userDetails =
                this.userDetailsRepository.findByUsername(email);
        if (!bCryptPasswordEncoder.matches(oldPassword, userDetails.getPassword())) {
            throw new RuntimeException();
        }
        userDetails.setPassword(bCryptPasswordEncoder.encode(newPassword));
        this.userDetailsRepository.saveAndFlush(userDetails);
    }

}
