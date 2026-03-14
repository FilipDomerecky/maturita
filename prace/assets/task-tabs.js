document.querySelectorAll('.task-tab').forEach(function(btn) {
    btn.addEventListener('click', function() {
        var tabId = this.getAttribute('data-tab');
        document.querySelectorAll('.task-tab').forEach(function(b) { b.classList.remove('active'); });
        document.querySelectorAll('.task-panel').forEach(function(p) { p.classList.remove('active'); });
        this.classList.add('active');
        var panel = document.getElementById('panel-' + tabId);
        if (panel) panel.classList.add('active');
    });
});
