package com.example.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        String path = request.getRequestURI();

        // Skip JWT validation for auth routes or non-API routes
        if (!path.startsWith("/api/") || path.startsWith("/api/auth/")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Handle preflight requests
        if (request.getMethod().equals("OPTIONS")) {
            filterChain.doFilter(request, response);
            return;
        }

        final String authHeader = request.getHeader("Authorization");

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Missing or invalid Authorization header");
            return;
        }

        String jwt = authHeader.substring(7);

        try {
            if (jwtUtil.isTokenValid(jwt)) {
                String role = jwtUtil.extractRole(jwt);
                request.setAttribute("userEmail", jwtUtil.extractEmail(jwt));
                request.setAttribute("userRole", role);
                
                // Basic role authorization check could go here if needed
            } else {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                response.getWriter().write("Invalid or expired JWT token");
                return;
            }
        } catch (Exception e) {
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            response.getWriter().write("Unauthorized: " + e.getMessage());
            return;
        }

        filterChain.doFilter(request, response);
    }
}
