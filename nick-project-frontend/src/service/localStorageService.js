
const LocalStorageService = (() => {

    let _service;

    const _getService = () => {
        if (_service) {
            _service = this;
        }
        return _service
    };

    const _setToken = (token) => {
        localStorage.setItem('access_token_cons', token);
    };

    const _getToken = () => {
        return localStorage.getItem('access_token_cons');
    };

    const _clearToken = () => {
        localStorage.removeItem('access_token_cons');
    };

    const _setRole = (role) => {
        localStorage.setItem('role_cons', role);
    };

    const _getRole = () => {
        return localStorage.getItem('role_cons');
    };

    const _clearRole = () => {
        localStorage.removeItem('role_cons');
    };

    const _setIdentifier = (identifier) => {
        localStorage.setItem('identifier_cons', identifier);
    };

    const _getIdentifier = () => {
        return localStorage.getItem('identifier_cons');
    };

    const _clearIdentifier = () => {
        localStorage.removeItem('identifier_cons');
    };

    return {
        getService: _getService,
        setToken: _setToken,
        getToken: _getToken,
        clearToken: _clearToken,
        setRole: _setRole,
        getRole: _getRole,
        clearRole: _clearRole,
        setIdentifier: _setIdentifier,
        getIdentifier: _getIdentifier,
        clearIdentifier: _clearIdentifier
    };

})();

export default LocalStorageService;
