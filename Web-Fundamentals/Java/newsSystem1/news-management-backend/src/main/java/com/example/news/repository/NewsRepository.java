package com.example.news.repository;

import com.example.news.model.News;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NewsRepository extends JpaRepository<News, Long> {
    // 基础的 CRUD 方法由 JpaRepository 提供
}