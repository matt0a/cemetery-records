package com.mtc.cemetery.cemetery_records.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.datatype.hibernate5.jakarta.Hibernate5JakartaModule;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class JacksonConfig {
    @Bean
    public Module hibernateModule() {
        Hibernate5JakartaModule m = new Hibernate5JakartaModule();
        // optional: avoid javax @Transient handling, keep it simple
        m.disable(Hibernate5JakartaModule.Feature.USE_TRANSIENT_ANNOTATION);
        // do NOT enable FORCE_LAZY_LOADING unless you really need it
        return m;
    }
}
