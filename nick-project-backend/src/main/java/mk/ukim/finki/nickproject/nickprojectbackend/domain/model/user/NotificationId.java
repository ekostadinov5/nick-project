package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.user;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class NotificationId extends DomainObjectId {

    protected NotificationId() {
        super(DomainObjectId.randomId(NotificationId.class).getId());
    }

    public NotificationId(String id) {
        super(id);
    }

}
