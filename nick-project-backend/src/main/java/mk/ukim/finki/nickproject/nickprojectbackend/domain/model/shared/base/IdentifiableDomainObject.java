package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base;

import java.io.Serializable;

public interface IdentifiableDomainObject<ID extends Serializable> extends DomainObject {

    ID id();

}
