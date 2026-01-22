package com.example.news.service;

import com.example.news.model.News;
import com.example.news.repository.NewsRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class NewsService {

    @Autowired
    private NewsRepository newsRepository;

    public List<News> getAllNews() {
        return newsRepository.findAll();
    }

    public Optional<News> getNewsById(Long id) {
        return newsRepository.findById(id);
    }

    public News createNews(News news) {
        // 可以在这里设置 author，例如从 SecurityContext 获取当前用户
        return newsRepository.save(news);
    }

    public News updateNews(Long id, News newsDetails, org.springframework.security.core.Authentication authentication) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found with id: " + id));

        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        // 权限检查：只有管理员或作者本人可以修改
        if (!isAdmin && !currentUsername.equals(news.getAuthor())) {
            throw new org.springframework.security.access.AccessDeniedException(
                    "You do not have permission to update this news.");
        }

        news.setTitle(newsDetails.getTitle());
        news.setContent(newsDetails.getContent());
        // 不更新 publishDate，只更新内容
        return newsRepository.save(news);
    }

    public void deleteNews(Long id, org.springframework.security.core.Authentication authentication) {
        News news = newsRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("News not found with id: " + id));

        String currentUsername = authentication.getName();
        boolean isAdmin = authentication.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ADMIN"));

        // 如果是 ADMIN 或 作者本人，允许删除
        if (isAdmin || currentUsername.equals(news.getAuthor())) {
            newsRepository.deleteById(id);
        } else {
            // 否则抛出 403 Forbidden
            throw new org.springframework.security.access.AccessDeniedException(
                    "You do not have permission to delete this news.");
        }
    }
}