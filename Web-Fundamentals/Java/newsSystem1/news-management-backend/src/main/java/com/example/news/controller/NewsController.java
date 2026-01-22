// com/example/news/controller/NewsController.java

package com.example.news.controller;

import com.example.news.model.News;
import com.example.news.service.NewsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/news")
public class NewsController {

    @Autowired
    private NewsService newsService;

    // 所有用户（包括未登录）都可以查看新闻列表
    // 关键修复: 明确匹配 "/" 和 "" 两种路径，以消除 /api/news 和 /api/news/ 的差异
    @GetMapping({ "", "/" })
    public List<News> getAllNews() {
        return newsService.getAllNews();
    }

    @GetMapping("/{id}")
    public ResponseEntity<News> getNewsById(@PathVariable Long id) {
        return newsService.getNewsById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 需要登录才能新增新闻
    @PostMapping({ "", "/" })
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<News> createNews(@RequestBody News news,
            org.springframework.security.core.Authentication authentication) {
        // 设置作者为当前登录用户
        String username = authentication.getName();
        news.setAuthor(username);

        News createdNews = newsService.createNews(news);
        return new ResponseEntity<>(createdNews, HttpStatus.CREATED);
    }

    // 需要登录才能修改新闻
    // Updated: Now allows authenticated users (checked in service for ownership)
    @PutMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<News> updateNews(@PathVariable Long id, @RequestBody News newsDetails,
            org.springframework.security.core.Authentication authentication) {
        try {
            News updatedNews = newsService.updateNews(id, newsDetails, authentication);
            return ResponseEntity.ok(updatedNews);
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }

    // 需要登录才能删除新闻
    @DeleteMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Void> deleteNews(@PathVariable Long id,
            org.springframework.security.core.Authentication authentication) {
        try {
            newsService.deleteNews(id, authentication);
            return ResponseEntity.noContent().build();
        } catch (org.springframework.security.access.AccessDeniedException e) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        } catch (RuntimeException e) {
            return ResponseEntity.notFound().build();
        }
    }
}