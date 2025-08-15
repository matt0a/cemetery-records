package com.mtc.cemetery.cemetery_records.weblayer.controllers;

import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/burial-records")
public class AdminBurialController {

    @PersistenceContext
    private EntityManager em;

    /**
     * Hard delete a burial by id (admin only).
     * Uses a direct JPQL delete + flush to guarantee the row is gone before response.
     */
    @DeleteMapping("/{id}")
    @Transactional
    public ResponseEntity<Void> deleteBurial(@PathVariable Long id) {
        int rows = em.createQuery("DELETE FROM BurialRecord b WHERE b.id = :id")
                .setParameter("id", id)
                .executeUpdate();
        em.flush();
        return (rows == 0)
                ? ResponseEntity.notFound().build()
                : ResponseEntity.noContent().build();
    }
}
