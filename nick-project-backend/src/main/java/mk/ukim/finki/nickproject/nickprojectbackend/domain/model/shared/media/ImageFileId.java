package mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.media;

import mk.ukim.finki.nickproject.nickprojectbackend.domain.model.shared.base.DomainObjectId;

import javax.persistence.Embeddable;

@Embeddable
public class ImageFileId extends DomainObjectId {

    protected ImageFileId() {
        super(DomainObjectId.randomId(DomainObjectId.class).getId());
    }

    public ImageFileId(String id) {
        super(id);
    }

}
